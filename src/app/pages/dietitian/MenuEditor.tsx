import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Save, Send, Trash2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createMenu,
  updateMenuBatch,
  submitBatch,
  getBatchItems,
  getBatchRejectionReason,
  extractErrorMessage,
  type MealType,
  type MenuItemRequest,
  type MenuBatch,
} from "../../services/dietitianService";

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

type MealFormState = {
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
};

const EMPTY_MEAL: MealFormState = {
  description: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
};

function itemKey(day: number, mealType: MealType) {
  return `${day}-${mealType}`;
}

const now = new Date();

export default function MenuEditor() {
  const { userId: userIdParam, batchId: batchIdParam } = useParams<{
    userId: string;
    batchId?: string;
  }>();
  const navigate = useNavigate();

  const userId = Number(userIdParam);
  const existingBatchId = batchIdParam ? Number(batchIdParam) : null;
  const isEditMode = existingBatchId !== null;

  // Year / Month
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [dietaryNotes, setDietaryNotes] = useState("");

  // Items: keyed by "day-mealType"
  const [items, setItems] = useState<Map<string, MenuItemRequest>>(new Map());

  // Current editor state
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeMeal, setActiveMeal] = useState<MealType>("BREAKFAST");
  const [mealForm, setMealForm] = useState<Record<MealType, MealFormState>>({
    BREAKFAST: { ...EMPTY_MEAL },
    LUNCH: { ...EMPTY_MEAL },
    DINNER: { ...EMPTY_MEAL },
    SNACK: { ...EMPTY_MEAL },
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<MealType, string>>>({});

  // Batch state
  const [activeBatchId, setActiveBatchId] = useState<number | null>(existingBatchId);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(isEditMode);
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load existing batch if in edit mode
  useEffect(() => {
    if (!isEditMode || !existingBatchId) return;
    setInitLoading(true);

    Promise.all([
      getBatchItems(existingBatchId),
      getBatchRejectionReason(existingBatchId),
    ])
      .then(([batchDetails, rejection]) => {
        // Populate year/month/dietaryNotes from batch metadata
        setYear(batchDetails.year);
        setMonth(batchDetails.month);
        setDietaryNotes(batchDetails.dietaryNotes ?? "");
        // Populate items map from returned batch items
        const map = new Map<string, MenuItemRequest>();
        for (const item of batchDetails.items) {
          map.set(itemKey(item.day, item.mealType), {
            day: item.day,
            mealType: item.mealType,
            description: item.description,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
          });
        }
        setItems(map);
        setRejectionReason(rejection.rejectionReason ?? null);
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to load batch.")))
      .finally(() => setInitLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingBatchId]);

  // When day or active meal changes, populate the form from items map
  useEffect(() => {
    const forms = {} as Record<MealType, MealFormState>;
    for (const mt of MEAL_TYPES) {
      const existing = items.get(itemKey(selectedDay, mt));
      forms[mt] = existing
        ? {
            description: existing.description,
            calories: String(existing.calories),
            protein: String(existing.protein),
            carbs: String(existing.carbs),
            fats: String(existing.fats),
          }
        : { ...EMPTY_MEAL };
    }
    setMealForm(forms);
    setFormErrors({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, items]);

  const updateMealField = (mt: MealType, field: keyof MealFormState, value: string) => {
    setMealForm((prev) => ({ ...prev, [mt]: { ...prev[mt], [field]: value } }));
    if (formErrors[mt]) setFormErrors((prev) => ({ ...prev, [mt]: undefined }));
  };

  const validateCurrentMeal = (mt: MealType): boolean => {
    const data = mealForm[mt];
    if (!data.description.trim()) return true; // empty = skip (no item for this slot)
    if (data.description.trim().length < 5) {
      setFormErrors((prev) => ({ ...prev, [mt]: "Description must be at least 5 characters." }));
      return false;
    }
    if (data.description.trim().length > 1000) {
      setFormErrors((prev) => ({ ...prev, [mt]: "Description must be 1000 characters or fewer." }));
      return false;
    }
    const nums = [data.calories, data.protein, data.carbs, data.fats];
    if (nums.some((n) => n !== "" && (isNaN(Number(n)) || Number(n) < 0))) {
      setFormErrors((prev) => ({ ...prev, [mt]: "Numeric fields must be 0 or greater." }));
      return false;
    }
    return true;
  };

  // Commit all 4 meals for current day into the items map
  const commitCurrentDay = (): boolean => {
    const newErrors: Partial<Record<MealType, string>> = {};
    let valid = true;
    const updatedMap = new Map(items);

    for (const mt of MEAL_TYPES) {
      const data = mealForm[mt];
      if (!data.description.trim()) {
        // Remove if previously existed
        updatedMap.delete(itemKey(selectedDay, mt));
        continue;
      }
      if (data.description.trim().length < 5) {
        newErrors[mt] = "Description must be at least 5 characters.";
        valid = false;
        continue;
      }
      if (data.description.trim().length > 1000) {
        newErrors[mt] = "Description must be 1000 characters or fewer.";
        valid = false;
        continue;
      }
      const calories = Number(data.calories) || 0;
      const protein = Number(data.protein) || 0;
      const carbs = Number(data.carbs) || 0;
      const fats = Number(data.fats) || 0;
      if ([calories, protein, carbs, fats].some((n) => n < 0)) {
        newErrors[mt] = "Numeric fields must be 0 or greater.";
        valid = false;
        continue;
      }
      updatedMap.set(itemKey(selectedDay, mt), {
        day: selectedDay,
        mealType: mt,
        description: data.description.trim(),
        calories, protein, carbs, fats,
      });
    }

    setFormErrors(newErrors);
    if (valid) setItems(updatedMap);
    return valid;
  };

  const buildDto = (committedItems?: Map<string, MenuItemRequest>) => ({
    userId,
    year,
    month,
    dietaryNotes: dietaryNotes.trim() || undefined,
    items: Array.from((committedItems ?? items).values()),
  });

  const handleSave = () => {
    if (!commitCurrentDay()) return;
    const committedItems = new Map(items);

    if (committedItems.size === 0) {
      toast.info("Add at least one meal before saving.");
      return;
    }

    setSaveLoading(true);
    const dto = buildDto(committedItems);

    const operation = activeBatchId
      ? updateMenuBatch(activeBatchId, dto)
      : createMenu(dto).then((batch: MenuBatch) => {
          setActiveBatchId(batch.batchId);
        });

    operation
      .then(() => toast.success(activeBatchId ? "Menu updated." : "Menu draft created."))
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to save menu.")))
      .finally(() => setSaveLoading(false));
  };

  const handleSubmit = () => {
    if (!commitCurrentDay()) return;
    const committedItems = new Map(items);

    if (committedItems.size === 0) {
      toast.info("Add at least one meal before submitting.");
      return;
    }

    setSubmitLoading(true);
    const dto = buildDto(committedItems);

    const save = activeBatchId
      ? updateMenuBatch(activeBatchId, dto)
      : createMenu(dto).then((batch: MenuBatch) => {
          setActiveBatchId(batch.batchId);
          return batch;
        });

    save
      .then((result) => {
        const batchId = activeBatchId ?? (result as MenuBatch)?.batchId;
        if (!batchId) throw new Error("Could not determine batch ID.");
        return submitBatch(batchId as number);
      })
      .then(() => {
        toast.success("Menu submitted to patient!");
        navigate(`/dietitian/patients/${userId}`);
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to submit menu.")))
      .finally(() => setSubmitLoading(false));
  };

  const handleDeleteDay = () => {
    const updated = new Map(items);
    for (const mt of MEAL_TYPES) updated.delete(itemKey(selectedDay, mt));
    setItems(updated);
    setMealForm({
      BREAKFAST: { ...EMPTY_MEAL },
      LUNCH: { ...EMPTY_MEAL },
      DINNER: { ...EMPTY_MEAL },
      SNACK: { ...EMPTY_MEAL },
    });
    toast.success(`Day ${selectedDay} meals cleared.`);
  };

  // When month/year changes, move selectedDay to first non-past day if current selection is past
  useEffect(() => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    if (new Date(year, month - 1, selectedDay) < todayMidnight) {
      const daysCount = new Date(year, month, 0).getDate();
      const firstValid = Array.from({ length: daysCount }, (_, i) => i + 1).find(
        (d) => new Date(year, month - 1, d) >= todayMidnight
      );
      setSelectedDay(firstValid ?? 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const dayHasData = (day: number) =>
    MEAL_TYPES.some((mt) => items.has(itemKey(day, mt)));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastDay = (day: number) => new Date(year, month - 1, day) < today;

  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const YEAR_OPTIONS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  if (initLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid lg:grid-cols-4 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="lg:col-span-3 h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/dietitian/patients/${userId}`)}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1>Menu Editor</h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? `Editing Batch #${activeBatchId}` : "Creating new menu"} for Patient #{userId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saveLoading || submitLoading}>
            {saveLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</> : <><Save className="size-4 mr-2" />Save Draft</>}
          </Button>
          <Button onClick={handleSubmit} disabled={saveLoading || submitLoading}>
            {submitLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Submitting...</> : <><Send className="size-4 mr-2" />Submit Menu</>}
          </Button>
        </div>
      </div>

      {/* Rejection reason banner */}
      {rejectionReason && (
        <Card className="bg-warning-light border-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Patient Rejection Feedback</p>
                <p className="text-sm text-muted-foreground mt-1">{rejectionReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Month/Year + dietary notes */}
      <Card>
        <CardHeader><CardTitle>Menu Details</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label>Dietary Notes (optional)</Label>
            <Input
              placeholder="e.g. Reduce sodium, no pork..."
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Day + Meal editor */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Day selector */}
        <Card>
          <CardHeader>
            <CardTitle>Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[32rem] overflow-y-auto pr-1">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const past = isPastDay(day);
                return (
                  <button
                    key={day}
                    onClick={() => !past && setSelectedDay(day)}
                    disabled={past}
                    title={past ? "Past date — cannot edit" : undefined}
                    className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between ${
                      past
                        ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground"
                        : selectedDay === day
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/70"
                    }`}
                  >
                    <span>Day {day}</span>
                    {dayHasData(day) && (
                      <span className={`size-2 rounded-full ${selectedDay === day ? "bg-primary-foreground" : "bg-success"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Meal editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Day {selectedDay} — Meals</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleDeleteDay}>
                <Trash2 className="size-4 mr-2" />
                Clear Day
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeMeal} onValueChange={(v) => setActiveMeal(v as MealType)}>
              <TabsList className="grid w-full grid-cols-4">
                {MEAL_TYPES.map((mt) => (
                  <TabsTrigger key={mt} value={mt} className="relative">
                    {MEAL_LABELS[mt]}
                    {items.has(itemKey(selectedDay, mt)) && (
                      <span className="absolute top-1 right-1 size-1.5 rounded-full bg-success" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {MEAL_TYPES.map((mt) => (
                <TabsContent key={mt} value={mt} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>
                      Description
                      <span className="ml-2 text-xs text-muted-foreground">
                        {mealForm[mt].description.length}/1000 (min 5)
                      </span>
                    </Label>
                    <Textarea
                      placeholder="Describe this meal in detail..."
                      value={mealForm[mt].description}
                      onChange={(e) => updateMealField(mt, "description", e.target.value)}
                      rows={3}
                      maxLength={1001}
                    />
                    {formErrors[mt] && (
                      <p className="text-xs text-destructive">{formErrors[mt]}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(["calories", "protein", "carbs", "fats"] as const).map((field) => (
                      <div key={field} className="space-y-2">
                        <Label className="capitalize">
                          {field === "calories" ? "Calories (kcal)" : `${field} (g)`}
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          value={mealForm[mt][field]}
                          onChange={(e) => updateMealField(mt, field, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (!validateCurrentMeal(mt)) return;
                      const data = mealForm[mt];
                      if (!data.description.trim()) {
                        // Clear slot
                        const updated = new Map(items);
                        updated.delete(itemKey(selectedDay, mt));
                        setItems(updated);
                        toast.info(`${MEAL_LABELS[mt]} for Day ${selectedDay} cleared.`);
                        return;
                      }
                      const updated = new Map(items);
                      updated.set(itemKey(selectedDay, mt), {
                        day: selectedDay,
                        mealType: mt,
                        description: data.description.trim(),
                        calories: Number(data.calories) || 0,
                        protein: Number(data.protein) || 0,
                        carbs: Number(data.carbs) || 0,
                        fats: Number(data.fats) || 0,
                      });
                      setItems(updated);
                      toast.success(`${MEAL_LABELS[mt]} for Day ${selectedDay} saved locally.`);
                    }}
                  >
                    <Save className="size-3.5 mr-1.5" />
                    Apply {MEAL_LABELS[mt]}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {items.size} meal slot{items.size !== 1 ? "s" : ""} added across{" "}
            {new Set(Array.from(items.values()).map((i) => i.day)).size} day
            {new Set(Array.from(items.values()).map((i) => i.day)).size !== 1 ? "s" : ""}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

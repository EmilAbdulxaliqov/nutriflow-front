import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Calendar, CheckCircle, XCircle, AlertCircle, Loader2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Skeleton } from "../../components/ui/skeleton";
import {
  getMyMenu,
  approveMenu,
  rejectMenu,
  extractErrorMessage,
  type MyMenu,
  type MenuItem,
  type MealType,
} from "../../services/userService";

const DELIVERY_NOTES_MAX = 500;
const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

function buildDate(year: number, month: number, day: number) {
  return new Date(year, month - 1, day);
}

export default function UserMenu() {
  const [menu, setMenu] = useState<MyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [notesError, setNotesError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const fetchMenu = () => {
    setLoading(true);
    setLoadError("");
    getMyMenu()
      .then((data) => {
        setMenu(data);
        setSelectedDayIndex(0);
      })
      .catch((err) => {
        const msg = extractErrorMessage(err, "Failed to load menu.");
        setLoadError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = () => {
    if (deliveryNotes.length > DELIVERY_NOTES_MAX) {
      setNotesError(`Delivery notes must be ${DELIVERY_NOTES_MAX} characters or fewer.`);
      return;
    }
    if (!menu) return;
    setApproveLoading(true);
    approveMenu({ batchId: menu.batchId, deliveryNotes })
      .then(() => {
        toast.success("Menu approved successfully!");
        setApproveDialogOpen(false);
        setDeliveryNotes("");
        setNotesError("");
        fetchMenu();
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to approve menu.")))
      .finally(() => setApproveLoading(false));
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    if (!menu) return;
    setRejectLoading(true);
    rejectMenu(menu.batchId, rejectionReason)
      .then(() => {
        toast.success("Menu feedback submitted.");
        setRejectDialogOpen(false);
        setRejectionReason("");
        fetchMenu();
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to submit feedback.")))
      .finally(() => setRejectLoading(false));
  };

  // Unique sorted day numbers from flat items
  const uniqueDays = useMemo(() => {
    if (!menu) return [];
    return [...new Set(menu.items.map((i) => i.day))].sort((a, b) => a - b);
  }, [menu]);

  const selectedDay = uniqueDays[selectedDayIndex] ?? null;

  // Items for the selected day, keyed by mealType
  const dayMeals = useMemo((): Partial<Record<MealType, MenuItem>> => {
    if (!menu || selectedDay === null) return {};
    return Object.fromEntries(
      menu.items.filter((i) => i.day === selectedDay).map((i) => [i.mealType, i])
    ) as Partial<Record<MealType, MenuItem>>;
  }, [menu, selectedDay]);

  const getDailyTotals = () => {
    const meals = Object.values(dayMeals);
    return {
      calories: meals.reduce((sum, m) => sum + (m?.calories ?? 0), 0),
      protein: meals.reduce((sum, m) => sum + (m?.protein ?? 0), 0),
      carbs: meals.reduce((sum, m) => sum + (m?.carbs ?? 0), 0),
      fats: meals.reduce((sum, m) => sum + (m?.fats ?? 0), 0),
    };
  };

  const totals = getDailyTotals();

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-56 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="space-y-6">
        <div><h1>My Menu</h1></div>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="size-5 flex-shrink-0" />
              <p className="text-sm">{loadError}</p>
            </div>
            {/* <Button variant="outline" className="mt-4" onClick={fetchMenu}>
              Try Again
            </Button> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!menu) {
    return (
      <div className="space-y-6">
        <div><h1>My Menu</h1></div>
        <Card>
          <CardContent className="py-16 text-center">
            <UtensilsCrossed className="size-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="font-medium">No menu available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your dietitian hasn't assigned a menu yet. Check back soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1>My Menu</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized monthly meal plan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRejectDialogOpen(true)}>
            <XCircle className="size-4 mr-2" />
            Request Changes
          </Button>
          <Button onClick={() => setApproveDialogOpen(true)}>
            <CheckCircle className="size-4 mr-2" />
            Approve Menu
          </Button>
        </div>
      </div>

      {/* Month / Batch Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            {new Date(menu.year, menu.month - 1).toLocaleString("default", { month: "long", year: "numeric" })}
          </CardTitle>
          <CardDescription>
            Batch #{menu.batchId} &mdash; Status: {menu.status}
            {menu.dietaryNotes && (
              <span className="ml-2 text-muted-foreground">· {menu.dietaryNotes}</span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Days List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Days</CardTitle>
            <CardDescription>Select a day to view meals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uniqueDays.map((dayNum, index) => (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedDayIndex === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  <div className="font-medium">Day {dayNum}</div>
                  <div className="text-sm opacity-80">
                    {buildDate(menu.year, menu.month, dayNum).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meals Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
          <CardTitle>Day {selectedDay} - Meals</CardTitle>
          <CardDescription>
            {selectedDay !== null
              ? buildDate(menu.year, menu.month, selectedDay).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Daily Totals */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-primary-light rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totals.calories}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totals.protein}g</div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totals.carbs}g</div>
                <div className="text-xs text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totals.fats}g</div>
                <div className="text-xs text-muted-foreground">Fats</div>
              </div>
            </div>

            {/* Meals Tabs */}
            {selectedDay !== null && (
              <Tabs defaultValue="BREAKFAST">
                <TabsList className="grid w-full grid-cols-4">
                  {MEAL_TYPES.map((mt) => (
                    <TabsTrigger key={mt} value={mt}>
                      {MEAL_LABELS[mt]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {MEAL_TYPES.map((mt) => {
                  const meal = dayMeals[mt];
                  return (
                    <TabsContent key={mt} value={mt} className="space-y-4">
                      {meal ? (
                        <>
                          <div>
                            <h3 className="mb-2">{MEAL_LABELS[mt]}</h3>
                            <p className="text-muted-foreground">{meal.description}</p>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="font-semibold">{meal.calories}</div>
                              <div className="text-xs text-muted-foreground">Calories</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="font-semibold">{meal.protein}g</div>
                              <div className="text-xs text-muted-foreground">Protein</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="font-semibold">{meal.carbs}g</div>
                              <div className="text-xs text-muted-foreground">Carbs</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="font-semibold">{meal.fats}g</div>
                              <div className="text-xs text-muted-foreground">Fats</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-sm py-4">
                          No {MEAL_LABELS[mt].toLowerCase()} planned for this day.
                        </p>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={(open) => { setApproveDialogOpen(open); if (!open) { setDeliveryNotes(""); setNotesError(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Menu</DialogTitle>
            <DialogDescription>
              Confirm that you're happy with this menu. Deliveries will begin as scheduled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryNotes">
                Delivery Notes (optional)
                <span className="ml-2 text-xs text-muted-foreground">{deliveryNotes.length}/{DELIVERY_NOTES_MAX}</span>
              </Label>
              <Textarea
                id="deliveryNotes"
                placeholder="Any special delivery instructions..."
                value={deliveryNotes}
                onChange={(e) => { setDeliveryNotes(e.target.value); if (notesError) setNotesError(""); }}
                rows={3}
                maxLength={DELIVERY_NOTES_MAX + 1}
              />
              {notesError && <p className="text-xs text-destructive">{notesError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)} disabled={approveLoading}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approveLoading}>
              {approveLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Approving...</> : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={(open) => { setRejectDialogOpen(open); if (!open) setRejectionReason(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Menu Changes</DialogTitle>
            <DialogDescription>
              Let your dietitian know what you'd like changed about this menu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Reason for changes (required)</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Please explain what you'd like changed..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={rejectLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectLoading}>
              {rejectLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Submitting...</> : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

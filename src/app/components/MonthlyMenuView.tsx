import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, RefreshCw, UtensilsCrossed } from "lucide-react";
import {
  getBatchItems,
  extractErrorMessage,
  type BatchDetailsResponse,
  type BatchItemResponse,
  type MonthlyMenuBatchItem,
  type MealType,
} from "../services/dietitianService";

// ─── Constants ────────────────────────────────────────────────────────────────

const MEAL_ORDER: MealType[] = ["BREAKFAST", "SNACK", "LUNCH", "DINNER"];

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  SNACK: "Snack",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

const MEAL_COLORS: Record<MealType, string> = {
  BREAKFAST: "bg-amber-100 text-amber-800",
  SNACK: "bg-green-100 text-green-800",
  LUNCH: "bg-blue-100 text-blue-800",
  DINNER: "bg-purple-100 text-purple-800",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemsByDayMeal = Record<number, Partial<Record<MealType, BatchItemResponse[]>>>;

// ─── MealTypeSection ──────────────────────────────────────────────────────────

interface MealTypeSectionProps {
  mealType: MealType;
  items: BatchItemResponse[];
}

function MealTypeSection({ mealType, items }: MealTypeSectionProps) {
  const hasItems = items.length > 0;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Meal type header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/40">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${MEAL_COLORS[mealType]}`}>
          {MEAL_LABELS[mealType]}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {!hasItems ? (
          <div className="flex items-center gap-2 text-muted-foreground py-1">
            <UtensilsCrossed className="size-3.5 shrink-0 opacity-50" />
            <p className="text-xs italic">No meal added</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-sm leading-snug">{item.description}</p>
              {/* Macros row */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">{item.calories}</span> kcal
                </span>
                <span>
                  <span className="font-medium text-foreground">{item.protein}g</span> protein
                </span>
                <span>
                  <span className="font-medium text-foreground">{item.carbs}g</span> carbs
                </span>
                <span>
                  <span className="font-medium text-foreground">{item.fats}g</span> fats
                </span>
              </div>
              {idx < items.length - 1 && <div className="border-t pt-2" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── DayMenuCard ──────────────────────────────────────────────────────────────

interface DayMenuCardProps {
  day: number;
  year: number;
  month: number;
  itemsByMeal: Partial<Record<MealType, BatchItemResponse[]>>;
}

function DayMenuCard({ day, year, month, itemsByMeal }: DayMenuCardProps) {
  const totalItems = Object.values(itemsByMeal).reduce(
    (sum, arr) => sum + (arr?.length ?? 0),
    0
  );
  const filledMeals = MEAL_ORDER.filter((mt) => (itemsByMeal[mt]?.length ?? 0) > 0);

  // Format the date label
  const date = new Date(year, month - 1, day);
  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const totalCalories = Object.values(itemsByMeal)
    .flat()
    .reduce((sum, item) => sum + (item?.calories ?? 0), 0);

  return (
    <AccordionItem value={String(day)} className="border rounded-lg px-0 overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40 transition-colors [&[data-state=open]]:bg-muted/40">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Day number */}
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {day}
          </div>
          {/* Date + summary */}
          <div className="flex flex-col items-start min-w-0">
            <span className="font-medium text-sm">{dateLabel}</span>
            {totalItems > 0 ? (
              <span className="text-xs text-muted-foreground">
                {totalCalories} kcal · {filledMeals.map((mt) => MEAL_LABELS[mt]).join(", ")}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">No meals planned</span>
            )}
          </div>
          {/* Item count badge */}
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-auto mr-2 shrink-0">
              {totalItems} meal{totalItems !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 pt-2">
        <div className="grid sm:grid-cols-2 gap-3">
          {MEAL_ORDER.map((mt) => (
            <MealTypeSection
              key={mt}
              mealType={mt}
              items={itemsByMeal[mt] ?? []}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// ─── MonthlyMenuView ──────────────────────────────────────────────────────────

interface PreloadedData {
  items: MonthlyMenuBatchItem[];
  year: number;
  month: number;
  dietaryNotes?: string | null;
}

interface MonthlyMenuViewProps {
  batchId: number;
  /** When provided, items are rendered directly without an API call. */
  preloaded?: PreloadedData;
}

export default function MonthlyMenuView({ batchId, preloaded }: MonthlyMenuViewProps) {
  const [data, setData] = useState<BatchDetailsResponse | null>(() => {
    if (!preloaded) return null;
    return {
      menuId: 0,
      batchId,
      year: preloaded.year,
      month: preloaded.month,
      dietaryNotes: preloaded.dietaryNotes ?? null,
      status: "APPROVED",          // placeholder – not used in rendering
      items: preloaded.items as BatchItemResponse[],
    };
  });
  const [loading, setLoading] = useState(!preloaded);
  const [error, setError] = useState("");

  const fetch = () => {
    setLoading(true);
    setError("");
    getBatchItems(batchId)
      .then(setData)
      .catch((err) => setError(extractErrorMessage(err, "Failed to load menu items.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (preloaded) {
      // Re-sync when preloaded data changes (e.g. after refetch in parent)
      setData({
        menuId: 0,
        batchId,
        year: preloaded.year,
        month: preloaded.month,
        dietaryNotes: preloaded.dietaryNotes ?? null,
        status: "APPROVED",
        items: preloaded.items as BatchItemResponse[],
      });
      return;
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId, preloaded]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <AlertCircle className="size-8 text-destructive opacity-70" />
        <p className="text-sm text-muted-foreground">{error || "Could not load menu."}</p>
        <Button variant="outline" size="sm" onClick={fetch}>
          <RefreshCw className="size-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // ── Build normalized structure ────────────────────────────────────────────
  const daysInMonth = new Date(data.year, data.month, 0).getDate();

  const itemsByDayMeal: ItemsByDayMeal = {};

  for (const item of data.items) {
    // Clamp: ignore items with day outside valid month range
    if (item.day < 1 || item.day > daysInMonth) continue;
    if (!itemsByDayMeal[item.day]) itemsByDayMeal[item.day] = {};
    if (!itemsByDayMeal[item.day][item.mealType]) {
      itemsByDayMeal[item.day][item.mealType] = [];
    }
    itemsByDayMeal[item.day][item.mealType]!.push(item);
  }

  const daysWithData = Object.keys(itemsByDayMeal)
    .map(Number)
    .sort((a, b) => a - b);

  const totalItems = data.items.length;
  const totalCalories = data.items.reduce((s, i) => s + i.calories, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-base">
            {MONTH_NAMES[data.month - 1]} {data.year}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {daysWithData.length} day{daysWithData.length !== 1 ? "s" : ""} planned
            {totalItems > 0 && ` · ${totalItems} meal slot${totalItems !== 1 ? "s" : ""} · ${totalCalories.toLocaleString()} kcal total`}
          </p>
        </div>
        {data.dietaryNotes && (
          <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2 max-w-xs">
            📝 {data.dietaryNotes}
          </p>
        )}
      </div>

      {/* Days accordion — only days that have items */}
      {daysWithData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No meals planned yet.</p>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={daysWithData.map(String)}
          className="space-y-2"
        >
          {daysWithData.map((day) => (
            <DayMenuCard
              key={day}
              day={day}
              year={data.year}
              month={data.month}
              itemsByMeal={itemsByDayMeal[day]}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}

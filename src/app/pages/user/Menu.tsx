import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Loader2,
  RefreshCw,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getMyMenu,
  approveMenu,
  rejectMenu,
  extractErrorMessage,
  type MyMenu,
  type MenuBatch,
  type MenuItem,
  type MealType,
  type MenuStatus,
} from "../../services/userService";

// ─── Constants ────────────────────────────────────────────────────────────────

const DELIVERY_NOTES_MAX = 500;
const MEAL_TYPE_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

const STATUS_STYLES: Record<MenuStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-blue-100 text-blue-800",
  SUBMITTED: "bg-indigo-100 text-indigo-800",
  READY: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Groups and sorts items by day (asc), then by meal type order within each day. */
function groupItemsByDay(items: MenuItem[]): Record<number, MenuItem[]> {
  const grouped: Record<number, MenuItem[]> = {};
  for (const item of items) {
    if (!grouped[item.day]) grouped[item.day] = [];
    grouped[item.day].push(item);
  }
  for (const day in grouped) {
    grouped[day].sort(
      (a, b) =>
        MEAL_TYPE_ORDER.indexOf(a.mealType) -
        MEAL_TYPE_ORDER.indexOf(b.mealType)
    );
  }
  return grouped;
}

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}

// ─── MenuDayGroup ─────────────────────────────────────────────────────────────

interface MenuDayGroupProps {
  day: number;
  items: MenuItem[];
  year: number;
  month: number;
}

function MenuDayGroup({ day, items, year, month }: MenuDayGroupProps) {
  const date = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const totals = items.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fats: acc.fats + m.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <AccordionItem value={`day-${day}`} className="border rounded-lg px-1">
      <AccordionTrigger className="px-3 hover:no-underline">
        <div className="flex items-center justify-between w-full pr-2">
          <span className="font-semibold text-sm">
            Day {day}{" "}
            <span className="font-normal text-muted-foreground">— {date}</span>
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {totals.calories} kcal · {totals.protein}g P · {totals.carbs}g C ·{" "}
            {totals.fats}g F
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-1 pr-3 font-medium w-24">Meal</th>
                <th className="text-left py-1 pr-3 font-medium">Description</th>
                <th className="text-right py-1 pr-3 font-medium w-20">kcal</th>
                <th className="text-right py-1 pr-3 font-medium w-16">P(g)</th>
                <th className="text-right py-1 pr-3 font-medium w-16">C(g)</th>
                <th className="text-right py-1 font-medium w-16">F(g)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 hover:bg-muted/40 transition"
                >
                  <td className="py-2 pr-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {MEAL_LABELS[item.mealType]}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    {item.description}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {item.calories}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {item.protein}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {item.carbs}
                  </td>
                  <td className="py-2 text-right tabular-nums">{item.fats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// ─── MenuBatchCard ────────────────────────────────────────────────────────────

interface MenuBatchCardProps {
  batch: MenuBatch;
  year: number;
  month: number;
  dietaryNotes: string | null;
  onApproved: () => void;
}

function MenuBatchCard({ batch, year, month, dietaryNotes, onApproved }: MenuBatchCardProps) {
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [notesError, setNotesError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const groupedDays = useMemo(
    () => groupItemsByDay(batch.items),
    [batch.items]
  );
  const sortedDays = useMemo(
    () => Object.keys(groupedDays).map(Number).sort((a, b) => a - b),
    [groupedDays]
  );

  // Active only for menus that are awaiting user confirmation
  const canApprove =
    batch.status === "SUBMITTED" ||
    batch.status === "READY" ||
    batch.status === "PENDING";

  const handleApprove = () => {
    if (deliveryNotes.length > DELIVERY_NOTES_MAX) {
      setNotesError(
        `Delivery notes must be ${DELIVERY_NOTES_MAX} characters or fewer.`
      );
      return;
    }
    setApproveLoading(true);
    approveMenu({ batchId: batch.batchId, deliveryNotes })
      .then(() => {
        toast.success("Menu approved successfully!");
        setDialogOpen(false);
        setDeliveryNotes("");
        setNotesError("");
        onApproved();
      })
      .catch((err) =>
        toast.error(extractErrorMessage(err, "Failed to approve menu."))
      )
      .finally(() => setApproveLoading(false));
  };

  const closeDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setDeliveryNotes("");
      setNotesError("");
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    setRejectLoading(true);
    rejectMenu(batch.batchId, rejectionReason)
      .then(() => {
        toast.success("Menu feedback submitted.");
        setRejectDialogOpen(false);
        setRejectionReason("");
        onApproved(); // refetch
      })
      .catch((err) =>
        toast.error(extractErrorMessage(err, "Failed to submit feedback."))
      )
      .finally(() => setRejectLoading(false));
  };

  return (
    <>
      <Card>
        {/* Batch Header */}
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <CalendarDays className="size-5 text-primary flex-shrink-0" />
              <div>
                <CardTitle className="text-base">
                  Batch #{batch.batchId} &mdash;{" "}
                  {monthLabel(year, month)}
                </CardTitle>
                {dietaryNotes && (
                  <CardDescription className="mt-0.5">
                    {dietaryNotes}
                  </CardDescription>
                )}
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold self-start sm:self-auto ${
                STATUS_STYLES[batch.status] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {batch.status}
            </span>
          </div>
        </CardHeader>

        {/* Days accordion */}
        <CardContent className="space-y-3">
          {sortedDays.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No items in this batch.
            </p>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {sortedDays.map((day) => (
                <MenuDayGroup
                  key={day}
                  day={day}
                  items={groupedDays[day]}
                  year={year}
                  month={month}
                />
              ))}
            </Accordion>
          )}

          {/* Batch actions */}
          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={!canApprove || rejectLoading}
              onClick={() => setRejectDialogOpen(true)}
              size="sm"
            >
              <XCircle className="size-4 mr-2" />
              Reject Menu
            </Button>
            <Button
              disabled={!canApprove || approveLoading}
              onClick={() => setDialogOpen(true)}
              size="sm"
            >
              <CheckCircle className="size-4 mr-2" />
              Approve Menu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Menu — Batch #{batch.batchId}</DialogTitle>
            <DialogDescription>
              Confirm that you're happy with this menu. Deliveries will begin as
              scheduled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`notes-${batch.batchId}`}>
              Delivery Notes (optional)
              <span className="ml-2 text-xs text-muted-foreground">
                {deliveryNotes.length}/{DELIVERY_NOTES_MAX}
              </span>
            </Label>
            <Textarea
              id={`notes-${batch.batchId}`}
              placeholder="Any special delivery instructions..."
              value={deliveryNotes}
              onChange={(e) => {
                setDeliveryNotes(e.target.value);
                if (notesError) setNotesError("");
              }}
              rows={3}
              maxLength={DELIVERY_NOTES_MAX + 1}
            />
            {notesError && (
              <p className="text-xs text-destructive">{notesError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={approveLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approveLoading}>
              {approveLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Approving…
                </>
              ) : (
                "Approve"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onOpenChange={(open) => {
          setRejectDialogOpen(open);
          if (!open) setRejectionReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Menu Changes — Batch #{batch.batchId}</DialogTitle>
            <DialogDescription>
              Let your dietitian know what you'd like changed about this menu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`reject-${batch.batchId}`}>
              Reason for changes (required)
            </Label>
            <Textarea
              id={`reject-${batch.batchId}`}
              placeholder="Please explain what you'd like changed..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={rejectLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectLoading}
            >
              {rejectLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── MyMenuPage ───────────────────────────────────────────────────────────────

export default function UserMenu() {
  const [menu, setMenu] = useState<MyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchMenu = () => {
    setLoading(true);
    setLoadError("");
    getMyMenu()
      .then((data) => setMenu(data))
      .catch((err) => {
        const status =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
        if (status === 404) {
          setMenu(null); // treat 404 as "no menu yet"
          return;
        }
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

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="space-y-6">
        <h1>My Menu</h1>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="size-5 flex-shrink-0" />
              <p className="text-sm">{loadError}</p>
            </div>
            <Button variant="outline" className="mt-4" onClick={fetchMenu}>
              <RefreshCw className="size-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!menu || menu.batches.length === 0) {
    return (
      <div className="space-y-6">
        <h1>My Menu</h1>
        <Card>
          <CardContent className="py-16 text-center">
            <UtensilsCrossed className="size-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="font-medium">No menus found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your dietitian hasn't assigned a menu yet. Check back soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1>My Menu</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized meal plans ({menu.batches.length}{" "}
            {menu.batches.length === 1 ? "batch" : "batches"})
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMenu}>
          <RefreshCw className="size-4 mr-2" />
          Refresh
        </Button>
      </div>

      {menu.batches.map((batch) => (
        <MenuBatchCard
          key={batch.batchId}
          batch={batch}
          year={menu.year}
          month={menu.month}
          dietaryNotes={menu.dietaryNotes}
          onApproved={fetchMenu}
        />
      ))}
    </div>
  );
}

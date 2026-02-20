import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

// Mock menu data
const mockMenu = {
  year: 2026,
  month: 2,
  days: Array.from({ length: 28 }, (_, i) => ({
    dayNumber: i + 1,
    date: new Date(2026, 1, i + 1).toISOString(),
    meals: {
      BREAKFAST: {
        description: "Greek yogurt parfait with mixed berries, granola, and honey drizzle",
        calories: 350,
        protein: 18,
        carbs: 45,
        fats: 12,
      },
      LUNCH: {
        description: "Grilled chicken breast with quinoa, roasted vegetables, and lemon herb dressing",
        calories: 520,
        protein: 42,
        carbs: 48,
        fats: 18,
      },
      DINNER: {
        description: "Baked salmon with sweet potato mash and steamed broccoli",
        calories: 480,
        protein: 38,
        carbs: 42,
        fats: 16,
      },
      SNACK: {
        description: "Apple slices with almond butter",
        calories: 180,
        protein: 6,
        carbs: 22,
        fats: 9,
      },
    },
  })),
};

export default function UserMenu() {
  const [selectedMonth, setSelectedMonth] = useState("2026-02");
  const [selectedDay, setSelectedDay] = useState(0);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const currentDay = mockMenu.days[selectedDay];

  const handleApprove = () => {
    toast.success("Menu approved successfully!");
    setApproveDialogOpen(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    toast.success("Menu feedback submitted");
    setRejectDialogOpen(false);
  };

  const getDailyTotals = () => {
    const meals = Object.values(currentDay.meals);
    return {
      calories: meals.reduce((sum, m) => sum + (m.calories || 0), 0),
      protein: meals.reduce((sum, m) => sum + (m.protein || 0), 0),
      carbs: meals.reduce((sum, m) => sum + (m.carbs || 0), 0),
      fats: meals.reduce((sum, m) => sum + (m.fats || 0), 0),
    };
  };

  const totals = getDailyTotals();

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

      {/* Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Select Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-02">February 2026</SelectItem>
              <SelectItem value="2026-03">March 2026</SelectItem>
              <SelectItem value="2026-04">April 2026</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
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
              {mockMenu.days.map((day, index) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(index)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedDay === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  <div className="font-medium">Day {day.dayNumber}</div>
                  <div className="text-sm opacity-80">
                    {new Date(day.date).toLocaleDateString("en-US", {
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
            <CardTitle>Day {currentDay.dayNumber} - Meals</CardTitle>
            <CardDescription>
              {new Date(currentDay.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
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
            <Tabs defaultValue="BREAKFAST">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="BREAKFAST">Breakfast</TabsTrigger>
                <TabsTrigger value="LUNCH">Lunch</TabsTrigger>
                <TabsTrigger value="DINNER">Dinner</TabsTrigger>
                <TabsTrigger value="SNACK">Snack</TabsTrigger>
              </TabsList>
              {Object.entries(currentDay.meals).map(([mealType, meal]) => (
                <TabsContent key={mealType} value={mealType} className="space-y-4">
                  <div>
                    <h3 className="mb-2">{mealType.charAt(0) + mealType.slice(1).toLowerCase()}</h3>
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
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Menu</DialogTitle>
            <DialogDescription>
              Confirm that you're happy with this menu. Deliveries will begin as scheduled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryNotes">Delivery Notes (optional)</Label>
              <Textarea
                id="deliveryNotes"
                placeholder="Any special delivery instructions..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
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
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

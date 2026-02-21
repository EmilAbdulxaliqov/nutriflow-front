import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { SubscriptionStatusBadge, MenuStatusBadge, DeliveryStatusBadge } from "../../components/StatusBadges";
import { Calendar, Package, User, CheckCircle, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "sonner";
import {
  getDashboardSummary,
  extractErrorMessage,
  type DashboardSummary,
} from "../../services/userService";

export default function UserDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = () => {
    setLoading(true);
    setError("");
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => {
        const msg = extractErrorMessage(err, "Failed to load dashboard.");
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPercentage = summary ? summary.progressPercentage : 0;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-6">
        <div><h1>Dashboard</h1></div>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="size-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
            <Button variant="outline" className="mt-4" onClick={fetchSummary}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1>Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          Here's your nutrition journey overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Subscription Status</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionStatusBadge status={summary.subscriptionStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Plan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{summary.planName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Menu Status</CardDescription>
          </CardHeader>
          <CardContent>
            <MenuStatusBadge status={summary.menuStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Next Renewal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{new Date(summary.nextRenewalDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Assigned Dietitian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {summary.dietitianFullName
                    ? summary.dietitianFullName.split(" ").map((n) => n[0]).join("")
                    : "—"}
                </div>
                <p className="text-sm font-medium">{summary.dietitianFullName ?? "Not assigned"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>
            {summary.completedDeliveries} of {summary.totalDays} deliveries completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{summary.completedDeliveries} completed</span>
            <span>{summary.totalDays - summary.completedDeliveries} remaining</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Menu Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Current Menu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.menuStatus === "APPROVED" ? (
              <>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="size-5" />
                  <span className="font-medium">Menu approved and active</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your personalized monthly menu is ready. View your daily meal plans and nutritional information.
                </p>
                <Button asChild className="w-full">
                  <Link to="/user/menu">
                    View Full Menu
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </>
            ) : summary.menuStatus === "PREPARING" ? (
              <>
                <div className="flex items-center gap-2 text-warning">
                  <Clock className="size-5" />
                  <span className="font-medium">Menu is being prepared</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your dietitian is creating your personalized menu. This usually takes 24-48 hours.
                </p>
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </>
            ) : summary.menuStatus === "REJECTED" ? (
              <>
                <div className="flex items-center gap-2 text-destructive">
                  <Clock className="size-5" />
                  <span className="font-medium">Menu needs revision</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please review the feedback and update your delivery preferences.
                </p>
                <Button variant="destructive" asChild className="w-full">
                  <Link to="/user/profile">Update Information</Link>
                </Button>
              </>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <Clock className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No menu available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              Today's Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.todayDelivery ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <DeliveryStatusBadge status={summary.todayDelivery.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Time</span>
                  <span className="text-sm">{summary.todayDelivery.estimatedTime}</span>
                </div>
                <div>
                  <span className="text-sm font-medium mb-2 block">Meals included</span>
                  <div className="flex flex-wrap gap-2">
                    {summary.todayDelivery.meals.map((meal) => (
                      <span
                        key={meal}
                        className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm"
                      >
                        {meal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Status Timeline */}
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    {[
                      { label: "Pending", completed: true },
                      {
                        label: "In Progress",
                        completed: summary.todayDelivery.status !== "PENDING",
                      },
                      {
                        label: "Ready",
                        completed:
                          summary.todayDelivery.status === "ON_THE_WAY" ||
                          summary.todayDelivery.status === "DELIVERED",
                      },
                      {
                        label: "On the Way",
                        completed: summary.todayDelivery.status === "DELIVERED",
                        current: summary.todayDelivery.status === "ON_THE_WAY",
                      },
                      {
                        label: "Delivered",
                        completed: summary.todayDelivery.status === "DELIVERED",
                      },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <div
                          className={`size-3 rounded-full ${
                            step.completed
                              ? "bg-success"
                              : "bg-muted border-2 border-muted-foreground"
                          } ${step.current ? "ring-4 ring-success/20" : ""}`}
                        />
                        <span
                          className={`text-sm ${
                            step.completed
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                <Package className="size-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No delivery scheduled for today.</p>
              </div>
            )}

            <Button variant="outline" asChild className="w-full">
              <Link to="/user/deliveries">View All Deliveries</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link to="/user/menu">
                <Calendar className="size-6" />
                <span>View Menu</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link to="/user/deliveries">
                <Package className="size-6" />
                <span>Track Deliveries</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link to="/user/profile">
                <User className="size-6" />
                <span>Update Profile</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

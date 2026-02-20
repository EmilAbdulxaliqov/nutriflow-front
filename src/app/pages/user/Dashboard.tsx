import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { SubscriptionStatusBadge, MenuStatusBadge, DeliveryStatusBadge } from "../../components/StatusBadges";
import { Calendar, Package, User, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

// Mock data
const mockUser = {
  name: "John Doe",
  subscriptionStatus: "ACTIVE" as const,
  menuStatus: "APPROVED" as const,
  nextRenewal: "2026-03-17",
  completedDeliveries: 12,
  totalDays: 30,
  assignedDietitian: "Dr. Sarah Johnson",
};

const mockTodayDelivery = {
  date: "2026-02-17",
  status: "ON_THE_WAY" as const,
  estimatedTime: "2:30 PM",
  meals: ["Breakfast", "Lunch", "Dinner"],
};

export default function UserDashboard() {
  const progressPercentage = (mockUser.completedDeliveries / mockUser.totalDays) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1>Welcome back, {mockUser.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">
          Here's your nutrition journey overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Subscription Status</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionStatusBadge status={mockUser.subscriptionStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Menu Status</CardDescription>
          </CardHeader>
          <CardContent>
            <MenuStatusBadge status={mockUser.menuStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Next Renewal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{new Date(mockUser.nextRenewal).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Assigned Dietitian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {mockUser.assignedDietitian.split(" ").map(n => n[0]).join("")}
              </div>
              <p className="text-sm font-medium">{mockUser.assignedDietitian}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>
            {mockUser.completedDeliveries} of {mockUser.totalDays} deliveries completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{mockUser.completedDeliveries} completed</span>
            <span>{mockUser.totalDays - mockUser.completedDeliveries} remaining</span>
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
            {mockUser.menuStatus === "APPROVED" ? (
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
            ) : mockUser.menuStatus === "PREPARING" ? (
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
            ) : mockUser.menuStatus === "REJECTED" ? (
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
            ) : null}
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <DeliveryStatusBadge status={mockTodayDelivery.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estimated Time</span>
              <span className="text-sm">{mockTodayDelivery.estimatedTime}</span>
            </div>
            <div>
              <span className="text-sm font-medium mb-2 block">Meals included</span>
              <div className="flex flex-wrap gap-2">
                {mockTodayDelivery.meals.map((meal) => (
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
                  { label: "In Progress", completed: true },
                  { label: "Ready", completed: true },
                  { label: "On the Way", completed: true, current: true },
                  { label: "Delivered", completed: false },
                ].map((step, index) => (
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

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { SubscriptionStatusBadge } from "../../components/StatusBadges";
import { AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const mockProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1 (555) 123-4567",
  city: "New York",
  district: "Manhattan",
  addressDetails: "123 Park Avenue, Apt 4B",
  deliveryNotes: "Ring doorbell twice",
  weight: "75",
  height: "175",
  goal: "weight_loss",
  restrictions: "Lactose intolerant, no shellfish",
  notes: "Prefer low-sodium meals",
  subscriptionStatus: "ACTIVE" as const,
  nextRenewal: "2026-03-17",
};

export default function UserProfile() {
  const [formData, setFormData] = useState(mockProfile);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  const handleCancelSubscription = () => {
    toast.success("Subscription cancelled. Active until " + mockProfile.nextRenewal);
    setCancelDialogOpen(false);
  };

  const bmi = formData.height && formData.weight 
    ? (Number(formData.weight) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1>Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="health">Health Data</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="size-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Data */}
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Data</CardTitle>
              <CardDescription>Update your health metrics and dietary preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                  />
                </div>
              </div>
              {bmi && (
                <div className="p-4 bg-primary-light rounded-lg">
                  <p className="text-sm font-medium">Current BMI: {bmi}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Select value={formData.goal} onValueChange={(value) => handleChange("goal", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="weight_gain">Weight Gain</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="health_improvement">General Health Improvement</SelectItem>
                    <SelectItem value="medical">Medical Dietary Requirements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restrictions">Dietary Restrictions / Allergies</Label>
                <Textarea
                  id="restrictions"
                  value={formData.restrictions}
                  onChange={(e) => handleChange("restrictions", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="size-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
              <CardDescription>Manage your delivery address and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressDetails">Full Address</Label>
                <Textarea
                  id="addressDetails"
                  value={formData.addressDetails}
                  onChange={(e) => handleChange("addressDetails", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryNotes">Delivery Instructions</Label>
                <Textarea
                  id="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={(e) => handleChange("deliveryNotes", e.target.value)}
                  placeholder="e.g., Ring doorbell twice, leave at reception..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="size-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your NutriFlow subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Plan</p>
                  <p className="font-semibold text-lg">Monthly Premium</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <SubscriptionStatusBadge status={formData.subscriptionStatus} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Next Renewal</p>
                  <p className="font-semibold">
                    {new Date(formData.nextRenewal).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Price</p>
                  <p className="font-semibold">$299/month</p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg mb-4">
                  <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Cancel Subscription</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your subscription will remain active until {new Date(formData.nextRenewal).toLocaleDateString()}. 
                      You can resubscribe at any time.
                    </p>
                  </div>
                </div>
                <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll continue to have access until {new Date(mockProfile.nextRenewal).toLocaleDateString()}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { SubscriptionStatusBadge } from "../../components/StatusBadges";
import { AlertCircle, CreditCard, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Skeleton } from "../../components/ui/skeleton";
import {
  getPersonalInfo,
  getSubscriptionInfo,
  updateProfile,
  cancelSubscription,
  createCheckoutSession,
  extractErrorMessage,
  type PersonalInfo,
  type SubscriptionInfo,
  type UpdateProfilePayload,
  type GoalType,
} from "../../services/userService";

const PHONE_PATTERN = /^\+?[\d\s\-().]{7,20}$/;
const DELIVERY_NOTES_MAX = 500;

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  district: string;
  addressDetails: string;
  deliveryNotes: string;
  weight: string;
  height: string;
  goal: string;
  restrictions: string;
  notes: string;
  password: string;
};

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  city: "",
  district: "",
  addressDetails: "",
  deliveryNotes: "",
  weight: "",
  height: "",
  goal: "",
  restrictions: "",
  notes: "",
  password: "",
};

export default function UserProfile() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [originalData, setOriginalData] = useState<FormData>(EMPTY_FORM);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    Promise.all([
      getPersonalInfo(),
      getSubscriptionInfo(),
    ])
      .then(([personal, sub]: [PersonalInfo, SubscriptionInfo]) => {
        const loaded: FormData = {
          firstName: personal.firstName ?? "",
          lastName: personal.lastName ?? "",
          email: personal.email ?? "",
          phoneNumber: personal.phoneNumber ?? "",
          city: personal.city ?? "",
          district: personal.district ?? "",
          addressDetails: personal.addressDetails ?? "",
          deliveryNotes: personal.deliveryNotes ?? "",
          weight: personal.weight != null ? String(personal.weight) : "",
          height: personal.height != null ? String(personal.height) : "",
          goal: personal.goal ?? "",
          restrictions: personal.restrictions ?? "",
          notes: personal.notes ?? "",
          password: "",
        };
        setFormData(loaded);
        setOriginalData(loaded);
        setSubscriptionInfo(sub);
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to load profile.")))
      .finally(() => setDataLoading(false));
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<string, string>> = {};
    if (formData.phoneNumber && !PHONE_PATTERN.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number (7-20 digits).";
    }
    if (formData.deliveryNotes.length > DELIVERY_NOTES_MAX) {
      errors.deliveryNotes = `Delivery notes must be ${DELIVERY_NOTES_MAX} characters or fewer.`;
    }
    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const payload: UpdateProfilePayload = {};
    if (formData.firstName !== originalData.firstName) payload.firstName = formData.firstName;
    if (formData.lastName !== originalData.lastName) payload.lastName = formData.lastName;
    if (formData.phoneNumber !== originalData.phoneNumber) payload.phoneNumber = formData.phoneNumber;
    if (formData.password) payload.password = formData.password;
    if (formData.city !== originalData.city) payload.city = formData.city;
    if (formData.district !== originalData.district) payload.district = formData.district;
    if (formData.addressDetails !== originalData.addressDetails) payload.addressDetails = formData.addressDetails;
    if (formData.deliveryNotes !== originalData.deliveryNotes) payload.deliveryNotes = formData.deliveryNotes;
    if (formData.weight !== originalData.weight && formData.weight) payload.weight = Number(formData.weight);
    if (formData.height !== originalData.height && formData.height) payload.height = Number(formData.height);
    if (formData.goal !== originalData.goal && formData.goal) payload.goal = formData.goal as GoalType;
    if (formData.restrictions !== originalData.restrictions) payload.restrictions = formData.restrictions;
    if (formData.notes !== originalData.notes) payload.notes = formData.notes;
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save.");
      return;
    }
    setSaveLoading(true);
    updateProfile(payload)
      .then(() => {
        toast.success("Profile updated successfully!");
        setOriginalData({ ...formData, password: "" });
        setFormData((prev) => ({ ...prev, password: "" }));
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to update profile.")))
      .finally(() => setSaveLoading(false));
  };

  const handleCancelSubscription = () => {
    setCancelLoading(true);
    cancelSubscription()
      .then(() => {
        toast.success(`Subscription cancelled. Active until ${subscriptionInfo?.endDate ?? "the end of the period"}.`);
        setCancelDialogOpen(false);
        getSubscriptionInfo().then(setSubscriptionInfo).catch(() => {});
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to cancel subscription.")))
      .finally(() => setCancelLoading(false));
  };

  const handleSubscribe = () => {
    setSubscribeLoading(true);
    createCheckoutSession()
      .then(({ checkoutUrl }) => {
        // Redirect to Stripe-hosted checkout
        window.location.href = checkoutUrl;
      })
      .catch((err) => {
        toast.error(extractErrorMessage(err, "Failed to start checkout. Please try again."));
        setSubscribeLoading(false);
      });
  };

  const bmi =
    formData.height && formData.weight
      ? (Number(formData.weight) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1)
      : null;

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (dataLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-96" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {/* <TabsTrigger value="delivery">Delivery</TabsTrigger> */}
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
                  readOnly
                  className="bg-muted cursor-not-allowed"
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
                {formErrors.phoneNumber && (
                  <p className="text-xs text-destructive">{formErrors.phoneNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                {formErrors.password && (
                  <p className="text-xs text-destructive">{formErrors.password}</p>
                )}
              </div>
              <Button onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</> : <><Save className="size-4 mr-2" />Save Changes</>}
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
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOSE">Lose Weight</SelectItem>
                    <SelectItem value="GAIN">Gain Weight</SelectItem>
                    <SelectItem value="MAINTAIN">Maintain Weight</SelectItem>
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
              <Button onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</> : <><Save className="size-4 mr-2" />Save Changes</>}
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
                <Label htmlFor="deliveryNotes">
                  Delivery Instructions
                  <span className="ml-2 text-xs text-muted-foreground">{formData.deliveryNotes.length}/{DELIVERY_NOTES_MAX}</span>
                </Label>
                <Textarea
                  id="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={(e) => handleChange("deliveryNotes", e.target.value)}
                  placeholder="e.g., Ring doorbell twice, leave at reception..."
                  rows={3}
                  maxLength={DELIVERY_NOTES_MAX + 1}
                />
                {formErrors.deliveryNotes && (
                  <p className="text-xs text-destructive">{formErrors.deliveryNotes}</p>
                )}
              </div>
              <Button onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</> : <><Save className="size-4 mr-2" />Save Changes</>}
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
              {/* No subscription yet — or cancelled/expired: show subscribe CTA */}
              {(!subscriptionInfo || subscriptionInfo.status === "INACTIVE" || subscriptionInfo.status === "CANCELLED" || subscriptionInfo.status === "EXPIRED") && (
                <div className="rounded-lg border-2 border-dashed border-primary/30 p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="size-14 rounded-full bg-primary-light flex items-center justify-center">
                      <CreditCard className="size-7 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">No active subscription</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Subscribe to NutriFlow Premium to get a personalized menu and daily meal deliveries.
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold">1500</span>
                    <span className="text-lg text-muted-foreground"> AZN/month</span>
                  </div>
                  <Button onClick={handleSubscribe} disabled={subscribeLoading} size="lg" className="w-full">
                    {subscribeLoading
                      ? <><Loader2 className="size-4 mr-2 animate-spin" />Redirecting to payment...</>
                      : <><CreditCard className="size-4 mr-2" />Subscribe Now</>}
                  </Button>
                </div>
              )}

              {/* Has a subscription: show details */}
              {subscriptionInfo && subscriptionInfo.status !== "INACTIVE" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Plan</p>
                      <p className="font-semibold text-lg">{subscriptionInfo.planName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Status</p>
                      <SubscriptionStatusBadge status={subscriptionInfo.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Next Renewal</p>
                      <p className="font-semibold">
                        {subscriptionInfo.endDate
                          ? new Date(subscriptionInfo.endDate).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Days Remaining</p>
                      <p className="font-semibold">{subscriptionInfo.daysRemaining} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Price</p>
                      <p className="font-semibold">{subscriptionInfo.price.toLocaleString()} AZN / month</p>
                    </div>
                  </div>

                  {subscriptionInfo.status === "ACTIVE" && (
                    <div className="pt-6 border-t">
                      <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg mb-4">
                        <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Cancel Subscription</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your subscription will remain active until{" "}
                            {subscriptionInfo.endDate
                              ? new Date(subscriptionInfo.endDate).toLocaleDateString()
                              : "the end of the period"}.
                            You can resubscribe at any time.
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </>
              )}
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
              Are you sure you want to cancel your subscription? You'll continue to have access until{" "}
              {subscriptionInfo?.endDate
                ? new Date(subscriptionInfo.endDate).toLocaleDateString()
                : "the end of the period"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={cancelLoading}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={cancelLoading}>
              {cancelLoading ? <><Loader2 className="size-4 mr-2 animate-spin" />Cancelling...</> : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

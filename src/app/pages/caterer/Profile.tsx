import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Save } from "lucide-react";
import { toast } from "sonner";

const mockProfile = {
  name: "Express Catering Co.",
  email: "contact@expresscatering.com",
  phone: "+1 (555) 987-6543",
  address: "456 Delivery Lane, Manhattan, NY 10001",
  status: "ACTIVE",
};

export default function CatererProfile() {
  const [formData, setFormData] = useState(mockProfile);

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your caterer profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your catering service details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-success-light rounded-lg">
            <span className="font-medium">Account Status</span>
            <Badge className="bg-success text-success-foreground">{formData.status}</Badge>
          </div>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Change Password</Label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <Button onClick={handleSave}>
            <Save className="size-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

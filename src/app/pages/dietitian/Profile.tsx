import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";

const mockProfile = {
  firstName: "Dr. Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@nutriflow.com",
  specialization: "Clinical Nutrition & Weight Management",
};

export default function DietitianProfile() {
  const [formData, setFormData] = useState(mockProfile);

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your professional profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
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
            <Label>Specialization</Label>
            <Input
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
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

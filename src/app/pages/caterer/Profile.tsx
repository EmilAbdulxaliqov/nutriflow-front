import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  getCatererProfile,
  updateCatererProfile,
  extractErrorMessage,
  type CatererProfile,
  type CatererProfileUpdateRequest,
} from "../../services/catererService";

const NAME_MIN = 2;
const NAME_MAX = 100;
const ADDRESS_MAX = 255;
const PASSWORD_MIN = 8;

export default function CatererProfile() {
  const [profile, setProfile] = useState<CatererProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  // Keep original for dirty-check
  const originalRef = useRef<CatererProfile | null>(null);

  useEffect(() => {
    getCatererProfile()
      .then((data) => {
        originalRef.current = data;
        setProfile(data);
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
        setAddress(data.address ?? "");
      })
      .catch((err) => {
        const msg = extractErrorMessage(err, "Failed to load profile.");
        setLoadError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    // Validate
    if (name.trim().length < NAME_MIN) {
      toast.error(`Business name must be at least ${NAME_MIN} characters.`);
      return;
    }
    if (name.trim().length > NAME_MAX) {
      toast.error(`Business name must be at most ${NAME_MAX} characters.`);
      return;
    }
    if (address.trim().length > ADDRESS_MAX) {
      toast.error(`Address must be at most ${ADDRESS_MAX} characters.`);
      return;
    }
    if (password && password.length < PASSWORD_MIN) {
      toast.error(`Password must be at least ${PASSWORD_MIN} characters.`);
      return;
    }

    // Build dirty-only payload
    const orig = originalRef.current;
    const dto: CatererProfileUpdateRequest = {};
    if (name.trim() !== (orig?.name ?? "")) dto.name = name.trim();
    if (email.trim() !== (orig?.email ?? "")) dto.email = email.trim();
    if (phone.trim() !== (orig?.phone ?? "")) dto.phone = phone.trim();
    if (address.trim() !== (orig?.address ?? "")) dto.address = address.trim();
    if (password) dto.password = password;

    if (Object.keys(dto).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setSaveLoading(true);
    updateCatererProfile(dto)
      .then(() => {
        toast.success("Profile updated successfully!");
        setPassword("");
        originalRef.current = { name: name.trim(), email: email.trim(), phone: phone.trim() || null, address: address.trim() || null };
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Failed to update profile.")))
      .finally(() => setSaveLoading(false));
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div><Skeleton className="h-8 w-24" /><Skeleton className="h-4 w-48 mt-2" /></div>
        <Card><CardContent className="pt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your caterer profile</p>
      </div>

      {loadError && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/50 text-destructive">
          <AlertCircle className="size-5 flex-shrink-0" />
          <p className="text-sm">{loadError}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your catering service details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX}
              disabled={saveLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saveLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={saveLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address
              <span className="ml-1 text-xs text-muted-foreground">(max {ADDRESS_MAX})</span>
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={ADDRESS_MAX}
              disabled={saveLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password
              <span className="ml-1 text-xs text-muted-foreground">(leave blank to keep current)</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={`Min ${PASSWORD_MIN} characters`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={saveLoading}
            />
          </div>
          <Button onClick={handleSave} disabled={saveLoading}>
            {saveLoading ? (
              <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><Save className="size-4 mr-2" />Save Changes</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

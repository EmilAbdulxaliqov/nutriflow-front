import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { submitHealthProfile } from "../../services/healthProfileService";
import type { HealthProfilePayload } from "../../services/healthProfileService";

const steps = [
  "Basic Metrics",
  "Goal",
  "Restrictions",
  "Address & Delivery",
  "Upload Files",
];

/** Map UI select values → API enum values */
const GOAL_MAP: Record<string, HealthProfilePayload["goal"]> = {
  weight_loss: "LOSE",
  weight_gain: "GAIN",
  maintenance: "MAINTAIN",
};

type StepErrors = Partial<Record<string, string>>;

export default function HealthDataSubmission() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    goal: "",
    restrictions: "",
    notes: "",
    city: "",
    district: "",
    addressDetails: "",
    deliveryNotes: "",
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for field as user types
    if (stepErrors[field]) setStepErrors({ ...stepErrors, [field]: undefined });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  /** Validate the current step and return true if valid */
  const validateStep = (): boolean => {
    const errors: StepErrors = {};

    switch (currentStep) {
      case 0: {
        const h = Number(formData.height);
        const w = Number(formData.weight);
        if (!formData.height) errors.height = "Height is required.";
        else if (h < 50 || h > 250) errors.height = "Height must be between 50 and 250 cm.";
        if (!formData.weight) errors.weight = "Weight is required.";
        else if (w < 20 || w > 300) errors.weight = "Weight must be between 20 and 300 kg.";
        break;
      }
      case 1:
        if (!formData.goal) errors.goal = "Please select a goal.";
        break;
      case 3:
        if (!formData.city.trim()) errors.city = "City is required.";
        if (!formData.addressDetails.trim()) errors.addressDetails = "Full address is required.";
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStepErrors({});
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setServerError("");
    setLoading(true);

    try {
      const payload: HealthProfilePayload = {
        height: Number(formData.height),
        weight: Number(formData.weight),
        goal: GOAL_MAP[formData.goal],
        restrictions: formData.restrictions,
        notes: formData.notes,
        addressDetails: formData.addressDetails,
        city: formData.city,
        district: formData.district,
        deliveryNotes: formData.deliveryNotes,
      };

      await submitHealthProfile(payload, files);
      toast.success("Health data submitted successfully!");

      // TODO: navigate to the appropriate next page (e.g. navigate("/pricing"))
      navigate("/pricing");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Submission failed. Please try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                />
                {stepErrors.height && (
                  <p className="text-xs text-destructive">{stepErrors.height}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
                {stepErrors.weight && (
                  <p className="text-xs text-destructive">{stepErrors.weight}</p>
                )}
              </div>
            </div>
            {formData.height && formData.weight && (
              <div className="p-4 bg-primary-light rounded-lg">
                <p className="text-sm font-medium">
                  BMI: {(Number(formData.weight) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1)}
                </p>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Your Goal</Label>
              <Select value={formData.goal} onValueChange={(value) => handleChange("goal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="weight_gain">Weight Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              {stepErrors.goal && (
                <p className="text-xs text-destructive">{stepErrors.goal}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restrictions">Dietary Restrictions / Allergies</Label>
              <Textarea
                id="restrictions"
                placeholder="e.g., Vegetarian, lactose intolerant, nut allergy..."
                value={formData.restrictions}
                onChange={(e) => handleChange("restrictions", e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any other information you'd like your dietitian to know..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {stepErrors.city && (
                  <p className="text-xs text-destructive">{stepErrors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  placeholder="Manhattan"
                  value={formData.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressDetails">Full Address</Label>
              <Textarea
                id="addressDetails"
                placeholder="Street address, apartment/unit number..."
                value={formData.addressDetails}
                onChange={(e) => handleChange("addressDetails", e.target.value)}
                rows={3}
              />
              {stepErrors.addressDetails && (
                <p className="text-xs text-destructive">{stepErrors.addressDetails}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryNotes">Delivery Instructions (optional)</Label>
              <Textarea
                id="deliveryNotes"
                placeholder="e.g., Ring doorbell, leave at reception..."
                value={formData.deliveryNotes}
                onChange={(e) => handleChange("deliveryNotes", e.target.value)}
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Medical/Health Documents (optional)</Label>
              <p className="text-sm text-muted-foreground">
                Upload any relevant medical records, test results, or prescriptions
              </p>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="size-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, JPG, PNG (max 10MB each)
                  </p>
                </label>
              </div>
            </div>
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files</Label>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="mb-2">Health Data Submission</h1>
        <p className="text-muted-foreground">
          Help us create your personalized meal plan
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle>{steps[currentStep]}</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
            >
              Back
            </Button>
            {currentStep === steps.length - 1 ? (
              <>
                {serverError && (
                  <p className="text-sm text-destructive self-center">{serverError}</p>
                )}
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit & Continue to Payment"}
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

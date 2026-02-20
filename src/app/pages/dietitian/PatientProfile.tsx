import { Link, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserLifecycleBadge } from "../../components/StatusBadges";
import { ArrowLeft, Calendar, FileText, ExternalLink } from "lucide-react";

const mockPatient = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  status: "DATA_SUBMITTED" as const,
  goal: "Weight Loss",
  bmi: "26.5",
  height: "165",
  weight: "72",
  restrictions: "Vegetarian, Lactose intolerant",
  notes: "Prefers Mediterranean-style meals. No spicy food.",
  files: [
    { id: "1", name: "Blood_Test_Results.pdf", url: "#" },
    { id: "2", name: "Medical_History.pdf", url: "#" },
  ],
};

export default function PatientProfile() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dietitian/patients">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1>{mockPatient.name}</h1>
          <p className="text-muted-foreground mt-1">{mockPatient.email}</p>
        </div>
        <UserLifecycleBadge status={mockPatient.status} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="font-semibold">{mockPatient.goal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BMI</p>
                <p className="font-semibold">{mockPatient.bmi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-semibold">{mockPatient.height} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-semibold">{mockPatient.weight} kg</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Dietary Restrictions</p>
              <p>{mockPatient.restrictions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
              <p>{mockPatient.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Medical Files
            </CardTitle>
            <CardDescription>Uploaded health documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPatient.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-primary" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <Link to={`/dietitian/menu-editor/${id}`}>
              <Calendar className="size-4 mr-2" />
              Create/Edit Menu
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

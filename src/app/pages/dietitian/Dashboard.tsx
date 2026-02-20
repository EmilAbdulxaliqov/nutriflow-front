import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Users, AlertCircle, Search, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { UserLifecycleBadge } from "../../components/StatusBadges";
import { useState } from "react";

const mockDashboardData = {
  totalPatients: 24,
  pendingMenus: 3,
  activeMenus: 18,
};

const mockUrgentPatients = [
  { id: "1", name: "Sarah Johnson", status: "DATA_SUBMITTED" as const, daysWaiting: 2 },
  { id: "2", name: "Mike Chen", status: "DATA_SUBMITTED" as const, daysWaiting: 1 },
  { id: "3", name: "Emma Wilson", status: "VERIFIED" as const, daysWaiting: 3 },
];

const mockPatients = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  name: `Patient ${i + 1}`,
  email: `patient${i + 1}@example.com`,
  status: ["ACTIVE", "DATA_SUBMITTED", "VERIFIED"][i % 3] as "ACTIVE" | "DATA_SUBMITTED" | "VERIFIED",
  goal: "Weight Loss",
  menuStatus: ["APPROVED", "PREPARING", "DRAFT"][i % 3],
}));

export default function DietitianDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your patients
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockDashboardData.totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Menus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{mockDashboardData.pendingMenus}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Menus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{mockDashboardData.activeMenus}</div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Patients */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-warning" />
            <CardTitle>Urgent - Awaiting Menu</CardTitle>
          </div>
          <CardDescription>Patients who need menu creation priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUrgentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-warning-light rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-warning text-warning-foreground flex items-center justify-center font-semibold">
                    {patient.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <UserLifecycleBadge status={patient.status} />
                      <span className="text-sm text-muted-foreground">• {patient.daysWaiting} days waiting</span>
                    </div>
                  </div>
                </div>
                <Button asChild>
                  <Link to={`/dietitian/menu-editor/${patient.id}`}>
                    Create Menu
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            My Patients
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Menu</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPatients.slice(0, 5).map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="text-muted-foreground">{patient.email}</TableCell>
                    <TableCell>
                      <UserLifecycleBadge status={patient.status} />
                    </TableCell>
                    <TableCell>{patient.goal}</TableCell>
                    <TableCell>{patient.menuStatus}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dietitian/patients/${patient.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/dietitian/patients">View All Patients</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

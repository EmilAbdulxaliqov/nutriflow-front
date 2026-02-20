import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { UserLifecycleBadge } from "../../components/StatusBadges";
import { Search, Filter } from "lucide-react";
import { Link } from "react-router";

const mockPatients = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: `Patient ${i + 1}`,
  email: `patient${i + 1}@example.com`,
  status: ["ACTIVE", "DATA_SUBMITTED", "VERIFIED", "REGISTERED"][i % 4] as const,
  goal: ["Weight Loss", "Muscle Gain", "Maintenance"][i % 3],
  menuStatus: ["APPROVED", "PREPARING", "DRAFT", "REJECTED"][i % 4],
}));

export default function DietitianPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockPatients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Patients</h1>
          <p className="text-muted-foreground mt-1">Manage your assigned patients</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="size-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Menu Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="text-muted-foreground">{patient.email}</TableCell>
                    <TableCell>
                      <UserLifecycleBadge status={patient.status} />
                    </TableCell>
                    <TableCell>{patient.goal}</TableCell>
                    <TableCell>{patient.menuStatus}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/dietitian/patients/${patient.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dietitian/menu-editor/${patient.id}`}>Menu</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

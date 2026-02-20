import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";
import { MenuStatusBadge } from "../../components/StatusBadges";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getMenus, type AdminMenu } from "../../services/adminService";

export default function AdminMenus() {
  const [menus, setMenus] = useState<AdminMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getMenus(0, 100);
        setMenus(data.content ?? []);
      } catch {
        toast.error("Failed to load menus");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = menus.filter(m =>
    String(m.id ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.batchId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>Menus</h1>
        <p className="text-muted-foreground mt-1">Overview of all monthly menus</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search menus..."
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
                  <TableHead>Menu ID</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Dietitian</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No menus found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((menu) => (
                    <TableRow key={menu.id ?? menu.batchId}>
                      <TableCell className="font-mono text-sm">{menu.id ?? "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{menu.batchId}</TableCell>
                      <TableCell>{menu.userName ?? menu.userEmail ?? "—"}</TableCell>
                      <TableCell>{menu.dietitianName ?? "—"}</TableCell>
                      <TableCell>{menu.month ?? "—"}</TableCell>
                      <TableCell>
                        <MenuStatusBadge status={menu.status as Parameters<typeof MenuStatusBadge>[0]["status"]} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {menu.createdAt ? new Date(menu.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, Plus, ToggleLeft, ToggleRight, Trash2, Loader2, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  getCaterers, createCaterer, toggleCatererStatus, deleteCaterer,
  type AdminCaterer,
} from "../../services/adminService";

export default function AdminCaterers() {
  const [caterers, setCaterers] = useState<AdminCaterer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rowLoadingMap, setRowLoadingMap] = useState<Record<number, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", password: "",
  });
  const fetchController = useRef<AbortController | null>(null);

  const fetchCaterers = async (page = 0) => {
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;
    setLoading(true);
    try {
      const { data } = await getCaterers(page);
      if (!controller.signal.aborted) {
        setCaterers(data.content ?? []);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.number);
      }
    } catch (err: unknown) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        toast.error("Failed to load caterers");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => { fetchCaterers(); }, []);

  const filtered = caterers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = async (id: number) => {
    setCaterers((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
    setRowLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      await toggleCatererStatus(id);
      toast.success("Status updated");
      await fetchCaterers(currentPage);
    } catch (err: unknown) {
      setCaterers((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Failed to update status");
    } finally {
      setRowLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCaterer(id);
      toast.success("Caterer deleted");
      await fetchCaterers(currentPage);
    } catch { toast.error("Failed to delete caterer"); }
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email, and password are required");
      return;
    }
    setSubmitting(true);
    try {
      await createCaterer(form);
      toast.success("Caterer created");
      setCreateDialogOpen(false);
      setForm({ name: "", email: "", phone: "", address: "", password: "" });
      fetchCaterers(0);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Failed to create caterer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Caterers</h1>
          <p className="text-muted-foreground mt-1">Manage catering services</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Caterer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search caterers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg border">
            {loading && caterers.length > 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Active Deliviries</TableHead>
                  <TableHead>Total Deliveries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && caterers.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No caterers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((caterer) => (
                    <TableRow key={caterer.id}>
                      <TableCell className="font-mono text-sm">{caterer.id}</TableCell>
                      <TableCell className="font-medium">{caterer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{caterer.email}</TableCell>
                      <TableCell className="text-muted-foreground">{caterer.phone ?? "—"}</TableCell>
                      <TableCell>{caterer.activeDeliveries ?? 0}</TableCell>
                      <TableCell>{caterer.totalDeliveries ?? 0}</TableCell>
                      <TableCell>
                        <Badge className={caterer.active ? "bg-success text-success-foreground" : ""}>
                          {caterer.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" disabled={rowLoadingMap[caterer.id] === true} onClick={() => handleToggle(caterer.id)}>
                            {rowLoadingMap[caterer.id] ? (
                              <Loader2 className="size-4 animate-spin text-muted-foreground" />
                            ) : caterer.active ? (
                              <ToggleRight className="size-4 text-success" />
                            ) : (
                              <ToggleLeft className="size-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(caterer.id)}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {(totalPages > 1 || totalElements > 0) && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                {totalElements} caterer{totalElements !== 1 ? "s" : ""} total
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={currentPage === 0 || loading} onClick={() => fetchCaterers(currentPage - 1)}>
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm">Page {currentPage + 1} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1 || loading} onClick={() => fetchCaterers(currentPage + 1)}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Caterer Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Caterer</DialogTitle>
            <DialogDescription>Create a new catering partner account</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Name</Label>
              <Input placeholder="Nutriflow Kitchen" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="caterer@nutriflow.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" placeholder="+994 55-000-00-00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address</Label>
              <Input placeholder="45 Nizami St, Baku" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? "Creating..." : "Create Caterer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


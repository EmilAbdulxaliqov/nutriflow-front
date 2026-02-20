import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { DeliveryStatusBadge } from "../../components/StatusBadges";
import { Search, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

const mockDeliveries = Array.from({ length: 15 }, (_, i) => ({
  id: `DEL-${String(i + 1).padStart(4, "0")}`,
  client: `Client ${i + 1}`,
  address: `${100 + i} Main St, Manhattan`,
  district: ["Manhattan", "Brooklyn", "Queens"][i % 3],
  status: ["PENDING", "IN_PROGRESS", "READY", "ON_THE_WAY"][i % 4] as const,
  estimatedTime: "2:30 PM",
  meals: 4,
}));

export default function CatererToday() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState<typeof mockDeliveries[0] | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [estimateTime, setEstimateTime] = useState("");
  const [failDialogOpen, setFailDialogOpen] = useState(false);
  const [failReason, setFailReason] = useState("");

  const filteredDeliveries = mockDeliveries.filter(d => {
    const matchesSearch = d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === "all" || d.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  const handleUpdateStatus = (id: string, status: string) => {
    toast.success(`Delivery ${id} status updated to ${status}`);
  };

  const handleUpdateTime = () => {
    toast.success("Estimated time updated");
  };

  const handleMarkFailed = () => {
    if (!failReason.trim()) {
      toast.error("Please provide a failure reason");
      return;
    }
    toast.success("Delivery marked as failed");
    setFailDialogOpen(false);
    setFailReason("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Today's Deliveries</h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDeliveries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {mockDeliveries.filter(d => d.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {mockDeliveries.filter(d => d.status === "IN_PROGRESS" || d.status === "READY").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">On the Way</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {mockDeliveries.filter(d => d.status === "ON_THE_WAY").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by client or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                <SelectItem value="Manhattan">Manhattan</SelectItem>
                <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                <SelectItem value="Queens">Queens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Meals</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Est. Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-mono text-sm">{delivery.id}</TableCell>
                    <TableCell className="font-medium">{delivery.client}</TableCell>
                    <TableCell className="text-muted-foreground">{delivery.address}</TableCell>
                    <TableCell>{delivery.meals}</TableCell>
                    <TableCell>
                      <DeliveryStatusBadge status={delivery.status} />
                    </TableCell>
                    <TableCell>{delivery.estimatedTime}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={delivery.status}
                          onValueChange={(value) => handleUpdateStatus(delivery.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="READY">Ready</SelectItem>
                            <SelectItem value="ON_THE_WAY">On the Way</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setFailDialogOpen(true);
                          }}
                        >
                          <XCircle className="size-4 text-destructive" />
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

      {/* Update Time Dialog */}
      <Dialog open={!!selectedDelivery && !failDialogOpen} onOpenChange={() => setSelectedDelivery(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Estimated Time</DialogTitle>
            <DialogDescription>
              Set the estimated delivery time for {selectedDelivery?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                <Clock className="size-4 inline mr-2" />
                Estimated Time
              </Label>
              <Input
                type="time"
                value={estimateTime}
                onChange={(e) => setEstimateTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDelivery(null)}>Cancel</Button>
            <Button onClick={handleUpdateTime}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Failed Dialog */}
      <Dialog open={failDialogOpen} onOpenChange={setFailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Delivery as Failed</DialogTitle>
            <DialogDescription>
              Provide a reason for the failed delivery
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Failure Reason (required)</Label>
              <Textarea
                placeholder="e.g., Customer not available, wrong address..."
                value={failReason}
                onChange={(e) => setFailReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFailDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleMarkFailed}>Mark as Failed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

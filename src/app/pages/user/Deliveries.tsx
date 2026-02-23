import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { DeliveryStatusBadge } from "../../components/StatusBadges";
import { Search, MapPin, Phone, Calendar as CalendarIcon, Clock, Package, AlertCircle, Notebook } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "sonner";
import { getDeliveries, extractErrorMessage, type Delivery } from "../../services/userService";

export default function UserDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    setLoading(true);
    setLoadError("");
    getDeliveries()
      .then(setDeliveries)
      .catch((err) => {
        const msg = extractErrorMessage(err, "Failed to load deliveries.");
        setLoadError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) =>
    (delivery.clientFullName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(delivery.deliveryId).includes(searchQuery)
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-52 mt-2" />
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="space-y-6">
        <div><h1>Deliveries</h1></div>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="size-5 flex-shrink-0" />
              <p className="text-sm">{loadError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Deliveries</h1>
        <p className="text-muted-foreground mt-1">
          Track your meal deliveries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {deliveries.filter((d) => d.status === "DELIVERED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {deliveries.filter((d) => d.status === "ON_THE_WAY").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {deliveries.filter((d) => d.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Delivery History</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search deliveries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Est. Time</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Package className="size-8 mx-auto mb-2 opacity-40" />
                      <p>{deliveries.length === 0 ? "No deliveries yet." : "No deliveries match your search."}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.deliveryId}>
                      <TableCell className="font-mono text-sm">#{delivery.deliveryId}</TableCell>
                      <TableCell>{delivery.clientFullName}</TableCell>
                      <TableCell>
                        {new Date(delivery.deliveryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>Day {delivery.dayNumber}</TableCell>
                      <TableCell>
                        <DeliveryStatusBadge status={delivery.status} />
                      </TableCell>
                      <TableCell>{delivery.district}</TableCell>
                      <TableCell>{delivery.estimatedTime ?? "—"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Details Sheet */}
      <Sheet open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedDelivery && (
            <>
              <SheetHeader>
                <SheetTitle>Delivery Details</SheetTitle>
                <SheetDescription>
                  <span className="font-mono">#{selectedDelivery.deliveryId}</span>
                  {" — "}{selectedDelivery.clientFullName}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 px-6">
                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  <DeliveryStatusBadge status={selectedDelivery.status} />
                </div>

                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Delivery Date</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(selectedDelivery.deliveryDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Estimated Time</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedDelivery.estimatedTime ?? "Not yet assigned"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address + Notes */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <MapPin className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Delivery Address</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    {selectedDelivery.fullAddress}
                  </p>
                  {selectedDelivery.deliveryNotes && (
                    <p className="text-sm text-muted-foreground pl-8 mt-1 italic">
                      Note: {selectedDelivery.deliveryNotes}
                    </p>
                  )}
                  <div className="flex items-start gap-3 my-2">
                    <Notebook className="size-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm font-medium">Caterer note:</div>
                  </div>
                  {selectedDelivery.catererNote && (
                    <p className="text-sm text-muted-foreground pl-8 mt-1 italic">
                      {selectedDelivery.catererNote}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <div className="flex items-start gap-3">
                    <Phone className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Contact Number</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedDelivery.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meals */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Meals Included</h4>
                  <div className="space-y-3 mb-2">
                    {selectedDelivery.meals.map((meal, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm">{meal.type}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {meal.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

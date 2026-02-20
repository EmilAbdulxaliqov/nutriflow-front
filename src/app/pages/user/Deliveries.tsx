import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { DeliveryStatusBadge } from "../../components/StatusBadges";
import { Search, MapPin, Phone, Calendar as CalendarIcon, Clock } from "lucide-react";

// Mock deliveries data
const mockDeliveries = Array.from({ length: 15 }, (_, i) => ({
  id: `DEL-${String(i + 1).padStart(4, "0")}`,
  deliveryDate: new Date(2026, 1, i + 1).toISOString(),
  dayNumber: i + 1,
  status: ["DELIVERED", "DELIVERED", "DELIVERED", "ON_THE_WAY", "PENDING"][
    Math.min(i, 4)
  ] as "DELIVERED" | "ON_THE_WAY" | "PENDING",
  district: "Manhattan",
  estimatedTime: "2:30 PM",
  fullAddress: "123 Park Avenue, Apt 4B, New York, NY 10016",
  phone: "+1 (555) 123-4567",
  meals: [
    { type: "Breakfast", description: "Greek yogurt parfait with berries" },
    { type: "Lunch", description: "Grilled chicken with quinoa" },
    { type: "Dinner", description: "Baked salmon with vegetables" },
    { type: "Snack", description: "Apple slices with almond butter" },
  ],
}));

export default function UserDeliveries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<typeof mockDeliveries[0] | null>(null);

  const filteredDeliveries = mockDeliveries.filter((delivery) =>
    delivery.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="text-2xl font-bold">{mockDeliveries.length}</div>
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
              {mockDeliveries.filter((d) => d.status === "DELIVERED").length}
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
              {mockDeliveries.filter((d) => d.status === "ON_THE_WAY").length}
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
              {mockDeliveries.filter((d) => d.status === "PENDING").length}
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
                  <TableHead>ID</TableHead>
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
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No deliveries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-mono text-sm">{delivery.id}</TableCell>
                      <TableCell>
                        {new Date(delivery.deliveryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>Day {delivery.dayNumber}</TableCell>
                      <TableCell>
                        <DeliveryStatusBadge status={delivery.status} />
                      </TableCell>
                      <TableCell>{delivery.district}</TableCell>
                      <TableCell>{delivery.estimatedTime}</TableCell>
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
                  <span className="font-mono">{selectedDelivery.id}</span>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
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
                        {selectedDelivery.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
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
                  <div className="space-y-3">
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

                {/* Status Timeline */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Delivery Timeline</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Pending", completed: true },
                      {
                        label: "In Progress",
                        completed:
                          selectedDelivery.status !== "PENDING",
                      },
                      {
                        label: "Ready",
                        completed:
                          selectedDelivery.status === "ON_THE_WAY" ||
                          selectedDelivery.status === "DELIVERED",
                      },
                      {
                        label: "On the Way",
                        completed: selectedDelivery.status === "DELIVERED",
                        current: selectedDelivery.status === "ON_THE_WAY",
                      },
                      {
                        label: "Delivered",
                        completed: selectedDelivery.status === "DELIVERED",
                      },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <div
                          className={`size-3 rounded-full ${
                            step.completed
                              ? "bg-success"
                              : "bg-muted border-2 border-muted-foreground"
                          } ${step.current ? "ring-4 ring-success/20" : ""}`}
                        />
                        <span
                          className={`text-sm ${
                            step.completed
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
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

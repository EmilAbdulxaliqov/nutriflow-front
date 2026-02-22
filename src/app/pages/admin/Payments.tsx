import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { getPayments, type AdminPayment } from "../../services/adminService";

export default function AdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getPayments(0, 100);
        setPayments(data.content ?? []);
      } catch {
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = payments.filter(p =>
    p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completed = payments.filter(p => p.status === "COMPLETED");
  const failed = payments.filter(p => p.status === "FAILED");
  const totalRevenue = completed.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1>Payments & Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Monitor payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-2xl font-bold">{payments.length * 1500} AZN</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">{payments.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-success">{completed.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-destructive">{failed.length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.userEmail}</TableCell>
                      <TableCell className="font-semibold">
                        {payment.amount} {payment.currency}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            payment.status === "COMPLETED"
                              ? "bg-success text-success-foreground"
                              : payment.status === "FAILED"
                              ? "bg-destructive text-destructive-foreground"
                              : ""
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="size-4" />
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

      {/* Payment Details Sheet */}
      <Sheet open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <SheetContent>
          {selectedPayment && (
            <>
              <SheetHeader>
                <SheetTitle>Payment Details</SheetTitle>
                <SheetDescription className="font-mono text-xs break-all">{selectedPayment.transactionId}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 px-5">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">
                    {selectedPayment.amount} {selectedPayment.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Email</p>
                  <p>{selectedPayment.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      selectedPayment.status === "COMPLETED"
                        ? "bg-success text-success-foreground"
                        : selectedPayment.status === "FAILED"
                        ? "bg-destructive text-destructive-foreground"
                        : ""
                    }
                  >
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p>{new Date(selectedPayment.paymentDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscription ID</p>
                  <p className="font-mono text-sm">{selectedPayment.subscriptionId ?? "—"}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}


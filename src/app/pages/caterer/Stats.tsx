import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getCatererStats, extractErrorMessage, type CatererStats } from "../../services/catererService";

export default function CatererStats() {
  const [stats, setStats] = useState<CatererStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getCatererStats()
      .then(setStats)
      .catch((err) => {
        const msg = extractErrorMessage(err, "Failed to load stats.");
        setLoadError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-36" /><Skeleton className="h-4 w-52 mt-2" /></div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Statistics</h1>
        <p className="text-muted-foreground mt-1">Your delivery performance overview</p>
      </div>

      {loadError && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/50 text-destructive">
          <AlertCircle className="size-5 flex-shrink-0" />
          <p className="text-sm">{loadError}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDeliveries ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats?.pendingDeliveries ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats?.inProgressDeliveries ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats?.deliveredDeliveries ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.failedDeliveries ?? 0}</div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

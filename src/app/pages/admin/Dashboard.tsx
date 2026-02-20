import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, ChefHat, Truck, DollarSign, Package, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { getDashboardStats, type DashboardStats } from "../../services/adminService";

function getDateRange(range: string): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  if (range === "7days") start.setDate(end.getDate() - 7);
  else if (range === "90days") start.setDate(end.getDate() - 90);
  else start.setDate(end.getDate() - 30);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T00:00:00`;
  return {
    start: fmt(start),
    end: fmt(end),
  };
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("30days");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<{ name: string; users: number; revenue: number; deliveries: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async (range: string) => {
    setLoading(true);
    try {
      const { start, end } = getDateRange(range);
      const { data } = await getDashboardStats(start, end);
      setStats(data);
      if (data.chartData && Object.keys(data.chartData).length > 0) {
        setChartData(
          Object.entries(data.chartData).map(([date, values]) => ({
            name: date,
            users: values.users ?? 0,
            revenue: values.revenue ?? 0,
            deliveries: values.deliveries ?? 0,
          }))
        );
      } else {
        setChartData([]);
      }
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(dateRange);
  }, [dateRange, fetchStats]);

  const stat = stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            NutriFlow platform overview and key metrics
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stat?.totalUsers ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{stat?.newUsersThisMonth ?? 0} this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dietitians</CardTitle>
            <ChefHat className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-2xl font-bold">{stat?.totalDietitians ?? 0}</div>
                <p className="text-xs text-muted-foreground">Active professionals</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Caterers</CardTitle>
            <Truck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-2xl font-bold">{stat?.totalCaterers ?? 0}</div>
                <p className="text-xs text-muted-foreground">Delivery partners</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">
                  ${(stat?.totalRevenue ?? 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">This period</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-success">
                {stat?.activeSubscriptions ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="size-4" />
              Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <CheckCircle className="size-4 text-success" />
                Success
              </span>
              {loading ? <Skeleton className="h-5 w-10" /> : (
                <span className="font-semibold">{stat?.successfulDeliveries ?? 0}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <XCircle className="size-4 text-destructive" />
                Failed
              </span>
              {loading ? <Skeleton className="h-5 w-10" /> : (
                <span className="font-semibold">{stat?.failedDeliveries ?? 0}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Menu Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              {loading ? <Skeleton className="h-5 w-10" /> : (
                <span className="font-semibold text-warning">{stat?.pendingMenus ?? 0}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Approved</span>
              {loading ? <Skeleton className="h-5 w-10" /> : (
                <span className="font-semibold text-success">{stat?.approvedMenus ?? 0}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Rejected</span>
              {loading ? <Skeleton className="h-5 w-10" /> : (
                <span className="font-semibold text-destructive">{stat?.rejectedMenus ?? 0}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Daily user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No chart data available for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Daily revenue in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--success))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No chart data available for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

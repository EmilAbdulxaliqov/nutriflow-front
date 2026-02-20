import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getLogs, type AdminLog } from "../../services/adminService";

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const fetchController = useRef<AbortController | null>(null);

  const fetchLogs = async (page = 0) => {
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;
    setLoading(true);
    try {
      const { data } = await getLogs(page, 20);
      if (!controller.signal.aborted) {
        setLogs(data.content ?? []);

        setTotalPages(data.page.totalPages);
        setTotalElements(data.page.totalElements);
        setCurrentPage(data.page.number);
      }
    } catch (err: unknown) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        toast.error("Failed to load logs");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.entityType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.details?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Monitor platform activity and changes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg border overflow-x-auto">
            {loading && logs.length > 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && logs.length === 0 ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        <Badge variant="outline" className="ml-1 text-xs">{log.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.entityType ?? "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{log.entityId ?? "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{log.ipAddress ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">{log.oldValue ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{log.newValue ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {log.details ?? "—"}
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
                {logs.length} of {totalElements} log{totalElements !== 1 ? "s" : ""} total
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled={currentPage === 0 || loading} onClick={() => fetchLogs(currentPage - 1)}>
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => {
                  // Always show first, last, current and its neighbours; collapse others with ellipsis
                  const showPage = i === 0 || i === totalPages - 1 || Math.abs(i - currentPage) <= 1;
                  const showEllipsisBefore = i === totalPages - 1 && currentPage < totalPages - 3;
                  const showEllipsisAfter = i === 0 && currentPage > 2;
                  return showPage ? (
                    <Button
                      key={i}
                      variant={i === currentPage ? "default" : "outline"}
                      size="sm"
                      className="min-w-8"
                      disabled={loading}
                      onClick={() => fetchLogs(i)}
                    >
                      {i + 1}
                    </Button>
                  ) : showEllipsisBefore || showEllipsisAfter ? (
                    <span key={i} className="px-1 text-muted-foreground select-none">…</span>
                  ) : null;
                })}
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1 || loading} onClick={() => fetchLogs(currentPage + 1)}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import { useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getToken } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { getSocket } from "@/lib/socket";

type Issue = {
  _id: string;
  type: string;
  description: string;
  status: string;
  assignedDept?: string;
  location: { lat: number; lng: number };
  createdAt: string;
};

export default function Admin() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) setAuthToken(token);
    fetchIssues();
    fetchAnalytics();
    // Join admin room and refresh on new issues
    getSocket()?.emit("join-admin");
    const s = getSocket();
    const onNew = () => fetchIssues();
    s?.on("newIssue", onNew);
    return () => {
      s?.off("newIssue", onNew);
    };
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/issues/all");
      setIssues(data);
    } catch (e) {
      toast.error("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setSavingId(id);
      await api.patch(`/issues/${id}/status`, { status });
      toast.success("Status updated");
      fetchIssues();
      fetchAnalytics();
    } catch {
      toast.error("Update failed");
    } finally {
      setSavingId(null);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get("/analytics/overview");
      setAnalytics(data);
    } catch {}
  };

  const [deptFilter, setDeptFilter] = useState<string>("all");
  const departments = Array.from(new Set(issues.map(i => i.assignedDept).filter(Boolean))) as string[];

  const groups = useMemo(() => {
    const by: Record<string, Issue[]> = { Pending: [], Assigned: [], "In Progress": [], Resolved: [] };
    const filtered = deptFilter === "all" ? issues : issues.filter(i => (i.assignedDept || "") === deptFilter);
    for (const i of filtered) {
      (by[i.status] ||= []).push(i);
    }
    return by;
  }, [issues, deptFilter]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-[hsl(var(--admin))]">Admin Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-sm">Filter by department:</span>
              <Select onValueChange={(v) => setDeptFilter(v)} defaultValue="all">
                <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {departments.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(["Pending", "Assigned", "In Progress", "Resolved"] as const).map((status) => (
              <div key={status}>
                <h2 className="text-xl font-semibold mb-3">{status}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {groups[status]?.map((i) => (
                    <Card key={i._id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{i.type}</span>
                          <span className="text-sm text-muted-foreground">{new Date(i.createdAt).toLocaleString()}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3">{i.description}</p>
                        <div className="flex items-center gap-2">
                          <Select defaultValue={i.status} onValueChange={(v) => updateStatus(i._id, v)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Assigned">Assigned</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" onClick={() => updateStatus(i._id, "Assigned")} disabled={savingId===i._id}>
                            {savingId===i._id ? "Updating..." : "Quick Assign"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h2 className="text-xl font-semibold mb-3">Analytics</h2>
              {analytics ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle>Top Issue Types</CardTitle></CardHeader>
                    <CardContent>
                      <ChartContainer config={{ count: { label: "Reports", color: "#6366f1" } }} className="h-64">
                        <BarChart data={analytics.topTypes}>
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Bar dataKey="count" fill="var(--color-count)" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Dept Satisfaction (avg)</CardTitle></CardHeader>
                    <CardContent>
                      <ChartContainer config={{ avgRating: { label: "Rating", color: "#22c55e" } }} className="h-64">
                        <BarChart data={analytics.deptRatings}>
                          <XAxis dataKey="department" />
                          <YAxis domain={[0,5]} />
                          <Bar dataKey="avgRating" fill="var(--color-avgRating)" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </BarChart>
                      </ChartContainer>
                      <div className="text-sm text-muted-foreground mt-2">
                        Total issues: {analytics.totals.totalIssues} · Resolved: {analytics.totals.resolvedIssues} · Resolution rate: {analytics.resolutionRate.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p>Loading analytics...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



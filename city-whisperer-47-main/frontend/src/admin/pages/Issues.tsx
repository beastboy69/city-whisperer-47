import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Issue = {
  _id: string;
  type: string;
  description: string;
  status: string;
  assignedDept?: string;
  createdAt: string;
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/issues/all");
      setIssues(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return issues
      .filter(i => (status === 'all' ? true : i.status === status))
      .filter(i => i.type.toLowerCase().includes(s) || i.description.toLowerCase().includes(s));
  }, [issues, status, q]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setSaving(id);
      await api.patch(`/issues/${id}/status`, { status: newStatus });
      toast.success("Updated");
      fetchIssues();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 justify-between mb-3">
        <h2 className="text-xl font-semibold">Issues</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="Search issues" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(i => (
              <TableRow key={i._id}>
                <TableCell>{i.type}</TableCell>
                <TableCell className="max-w-[420px] truncate">{i.description}</TableCell>
                <TableCell>{i.status}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => updateStatus(i._id, "Resolved")} disabled={saving===i._id}>Resolve</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(i._id, "Pending")} disabled={saving===i._id}>Unresolve</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}




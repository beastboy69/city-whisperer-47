import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

type Feedback = { _id: string; issueId: string; rating: number; comment?: string; createdAt: string };

export default function FeedbackPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/feedbacks").then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter(f => (f.comment || "").toLowerCase().includes(s) || String(f.rating).includes(s) || f.issueId.toString().toLowerCase().includes(s));
  }, [items, q]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <Input placeholder="Search feedback" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(f => (
              <TableRow key={f._id}>
                <TableCell>{f.issueId}</TableCell>
                <TableCell>{f.rating}</TableCell>
                <TableCell className="max-w-[420px] truncate">{f.comment}</TableCell>
                <TableCell>{new Date(f.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}




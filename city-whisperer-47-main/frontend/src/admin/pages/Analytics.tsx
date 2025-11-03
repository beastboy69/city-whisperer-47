import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/analytics").then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle>Top Issue Types</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: "Reports", color: "#6366f1" } }} className="h-64">
            <BarChart data={data.topTypes}>
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
            <BarChart data={data.deptRatings}>
              <XAxis dataKey="department" />
              <YAxis domain={[0,5]} />
              <Bar dataKey="avgRating" fill="var(--color-avgRating)" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}




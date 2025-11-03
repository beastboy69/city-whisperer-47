import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

export default function Overview() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/analytics")
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  const statusData = [
    { name: 'Resolved', value: data.totals.resolvedIssues },
    { name: 'Pending', value: Math.max(0, data.totals.totalIssues - data.totals.resolvedIssues) },
  ];

  const COLORS = ["#22c55e", "#f97316"]; 

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader><CardTitle>Totals</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>Total Users (citizens): {Math.round((data.adoptionRate/100)*100000)}</div>
          <div>Total Issues: {data.totals.totalIssues}</div>
          <div>Resolved Issues: {data.totals.resolvedIssues}</div>
          <div>Resolution Rate: {data.resolutionRate.toFixed(1)}%</div>
          <div>Avg Resolution Time: {Math.round(data.avgResolutionTime/3600000)}h</div>
          <div>Data Accuracy: {data.dataAccuracy.toFixed(1)}%</div>
          <div>Avg Satisfaction: {data.satisfaction.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
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
        <CardHeader><CardTitle>Issue Status</CardTitle></CardHeader>
        <CardContent>
          <PieChart width={300} height={240}>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
}




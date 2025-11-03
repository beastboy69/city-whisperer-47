import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, IssueStatus } from "@/components/StatusBadge";
import { MapPin, Calendar, FileText, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import api, { setAuthToken } from "@/lib/api";
import { getToken, getUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Issue = { _id: string; type: string; description: string; status: string; location: { lat: number; lng: number }; createdAt: string };

export default function Track() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token || !user) return;
    setAuthToken(token);
    api
      .get(`/issues/user`)
      .then(({ data }) => setIssues(data))
      .catch(() => toast.error("Failed to load issues"));
  }, []);

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toBadge = (status: string): IssueStatus => {
    const s = status.toLowerCase();
    if (s.includes("progress")) return "progress";
    if (s.includes("assigned")) return "assigned";
    if (s.includes("resolved")) return "resolved";
    return "pending";
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Track Issues</h1>
          <p className="text-muted-foreground">
            Monitor the status of your reported issues
          </p>
        </div>

        {issues.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                You haven't reported any issues yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card key={issue._id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{issue.type}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(issue.createdAt)}
                      </CardDescription>
                    </div>
                    <StatusBadge status={toBadge(issue.status)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{issue.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <iframe
                      title="map"
                      width="100%"
                      height="160"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}&z=15&output=embed`}
                      className="rounded-md border border-border"
                    />
                  </div>
                  {toBadge(issue.status) === "resolved" && (
                    <div className="mt-3">
                      <Link to={`/feedback/${issue._id}`} className="inline-flex items-center text-primary hover:underline">
                        <MessageSquare className="h-4 w-4 mr-1" /> Give Feedback
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

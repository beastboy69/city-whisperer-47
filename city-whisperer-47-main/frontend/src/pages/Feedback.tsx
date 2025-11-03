import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api, { setAuthToken } from "@/lib/api";
import { getToken } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Feedback() {
  const { issueId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    const token = getToken();
    if (token) setAuthToken(token);
    try {
      await api.post(`/feedbacks/${issueId}`, { rating, comment });
      toast.success("Thank you for your feedback!");
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Rate your experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Button key={n} variant={rating === n ? "default" : "outline"} onClick={() => setRating(n)}>
                  {n}
                </Button>
              ))}
            </div>
            <Textarea placeholder="Optional comments" value={comment} onChange={(e) => setComment(e.target.value)} />
            <Button onClick={submit} className="w-full">Submit</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



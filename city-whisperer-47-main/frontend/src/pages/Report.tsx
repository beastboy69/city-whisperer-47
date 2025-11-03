import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, Upload, CheckCircle2, Cloud } from "lucide-react";
import { toast } from "sonner";
import api, { setAuthToken } from "@/lib/api";
import { getToken } from "@/hooks/useAuth";

declare global {
  interface Window {
    cloudinary?: any;
  }
}

const issueTypes = [
  "Pothole",
  "Broken Streetlight",
  "Garbage Collection",
  "Water Leak",
  "Damaged Sidewalk",
  "Graffiti",
  "Traffic Signal Issue",
  "Other",
];

export default function Report() {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const getLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
          toast.success("Location captured successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Please try again.");
          setIsLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCloudinary = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
    if (!cloudName || !window.cloudinary) {
      toast.message("Cloudinary not configured. Using local upload fallback.");
      document.getElementById("photo")?.click();
      return;
    }
    setUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        // For production, use a signed preset or signed upload via backend.
        uploadPreset: "unsigned_preset",
        multiple: false,
        sources: ["local", "camera"],
        cropping: false,
      },
      (error: any, result: any) => {
        if (error) {
          setUploading(false);
          toast.error("Upload failed");
          return;
        }
        if (result && result.event === "success") {
          setImagePreview(result.info.secure_url);
          setUploading(false);
          toast.success("Image uploaded");
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueType || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!location) {
      toast.error("Please capture your location");
      return;
    }

    try {
      const token = getToken();
      if (token) setAuthToken(token);
      await api.post("/issues", {
        type: issueType,
        description,
        location,
        image: imagePreview || undefined,
      });
      toast.success("Issue reported successfully! You'll receive updates via notifications.");
      setIssueType("");
      setDescription("");
      setLocation(null);
      setImagePreview(null);
    } catch (err) {
      toast.error("Failed to submit. Please login and try again.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">
            Help us improve your city by reporting issues you encounter
          </p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>
              Provide information about the issue you're reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type */}
              <div className="space-y-2">
                <Label htmlFor="issue-type">Issue Type *</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger id="issue-type">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Photo Evidence (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openCloudinary}
                    className="w-full"
                    disabled={uploading}
                  >
                    <Cloud className="mr-2 h-4 w-4" />
                    {uploading ? "Uploading..." : imagePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                </div>
                {imagePreview && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location *</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={getLocation}
                  disabled={isLoading}
                  className="w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {location
                    ? "Location Captured"
                    : isLoading
                    ? "Getting Location..."
                    : "Capture Current Location"}
                </Button>
                {location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-2 rounded">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                    </span>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

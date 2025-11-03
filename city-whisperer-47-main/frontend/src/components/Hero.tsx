import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Camera, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-city.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Smart City"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Building Cleaner,{" "}
            <span className="text-primary">Smarter Cities</span> Together
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Report city issues instantly with photos and location. Track progress in real-time.
            Help make your community better, one fix at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="text-lg" asChild>
              <Link to="/report">
                Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <Link to="/track">Track My Reports</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Camera className="h-6 w-6" />}
              title="Photo Evidence"
              description="Upload photos to document the issue clearly"
            />
            <FeatureCard
              icon={<MapPin className="h-6 w-6" />}
              title="Auto Location"
              description="GPS coordinates captured automatically"
            />
            <FeatureCard
              icon={<Bell className="h-6 w-6" />}
              title="Live Updates"
              description="Get notified at every status change"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border card-shadow">
      <div className="text-primary mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

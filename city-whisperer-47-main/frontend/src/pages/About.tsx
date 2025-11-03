import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">About SmartCityFix</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Empowering citizens and city officials to collaborate on creating cleaner, 
            safer, and more efficient urban environments through technology.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            SmartCityFix bridges the gap between citizens and city management by providing 
            a seamless platform for reporting, tracking, and resolving urban infrastructure 
            issues. We believe that by making it easier for citizens to report problems 
            and for officials to respond efficiently, we can create cities that work better 
            for everyone.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FeatureCard
            icon={<Target className="h-8 w-8" />}
            title="Precision Reporting"
            description="GPS-enabled location tracking ensures issues are pinpointed accurately for faster resolution"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Community Driven"
            description="Empower citizens to take an active role in maintaining and improving their neighborhoods"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Real-Time Updates"
            description="Stay informed with instant notifications at every stage of the resolution process"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Secure & Reliable"
            description="Your data is protected with industry-standard security measures and encryption"
          />
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">10K+</div>
                <div className="text-sm opacity-90">Issues Resolved</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">5K+</div>
                <div className="text-sm opacity-90">Active Citizens</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">48hrs</div>
                <div className="text-sm opacity-90">Avg. Resolution</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">95%</div>
                <div className="text-sm opacity-90">Satisfaction Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
    <Card className="card-shadow">
      <CardContent className="p-6">
        <div className="text-primary mb-3">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

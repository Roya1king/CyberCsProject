import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, Network, LineChart } from "lucide-react";

const Welcome = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col gap-10 items-center justify-start text-center px-4 py-10 overflow-hidden">
      {/* Background dotted globe and lines */}
      <div aria-hidden className="globe-dots" />
      <div className="absolute top-4 left-4 hidden lg:block">
        <img src="/cybersec.png" alt="logo" className="w-32 h-auto rounded-md" />
      </div>

      <div className="w-full max-w-6xl flex justify-end">
        <Link
          to="/dashboard"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
        >
          Go to Dashboard
        </Link>
      </div>
      <div>
      
        <h1 className="text-3xl md:text-5xl font-bold">Cyber Security Monitoring Console</h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          A unified dashboard for real-time packet visibility, detection insights, policy enforcement, and network health.
          Analyze live traffic, prioritize threats, and make data‑driven decisions faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-5xl">
        <Card>
          <CardHeader className="items-center">
            <Activity className="text-primary" />
            <CardTitle>Live Packets</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Real-time traffic view</CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center">
            <ShieldCheck className="text-primary" />
            <CardTitle>Threats</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Detections and severity</CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center">
            <Network className="text-primary" />
            <CardTitle>Policies</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Violations and actions</CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center">
            <LineChart className="text-primary" />
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Trends and capacity</CardContent>
        </Card>
      </div>

      <div className="w-full max-w-6xl">
        <div className="walkthrough-line grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          <div className="walkthrough-node">
            <Card>
              <CardHeader className="items-center">
                <Activity className="text-primary" />
                <CardTitle>Capture</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Ingest packets and metadata.
              </CardContent>
            </Card>
          </div>
          <div className="walkthrough-node">
            <Card>
              <CardHeader className="items-center">
                <ShieldCheck className="text-primary" />
                <CardTitle>Detect</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Identify threats and anomalies.
              </CardContent>
            </Card>
          </div>
          <div className="walkthrough-node">
            <Card>
              <CardHeader className="items-center">
                <Network className="text-primary" />
                <CardTitle>Enforce</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Apply and monitor policies.
              </CardContent>
            </Card>
          </div>
          <div className="walkthrough-node">
            <Card>
              <CardHeader className="items-center">
                <LineChart className="text-primary" />
                <CardTitle>Analyze</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Explore trends and insights.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Welcome;



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface NetworkGaugeProps {
  value: number; // 0 to 100
  className?: string;
}

const NetworkGauge = ({ value, className }: NetworkGaugeProps) => {

  let color = "";
  let status = "";
  if (value >= 75) {
    color = "#22c55e"; // green
    status = "Good";
  } else if (value >= 40) {
    color = "#facc15"; // yellow
    status = "Moderate";
  } else {
    color = "#ef4444"; // red
    status = "Bad";
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          <Link to="/dashboard/network" className="hover:underline">Network Status</Link>
        </CardTitle>
        <Network className="text-gray-500" />
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <Progress value={value} />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">0%</span>
          <span className="text-2xl md:text-3xl font-bold leading-none">{value}%</span>
          <span className="text-muted-foreground">100%</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold leading-tight">{status}</p>
          <p className="text-xs text-muted-foreground leading-tight">Network strength</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkGauge;

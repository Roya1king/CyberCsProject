import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";
import { Link } from "react-router-dom";

interface BandwidthCardProps {
  used: number; // e.g., 120
  total: number; // e.g., 500
  unit?: string; // e.g., "Mbps"
  className?: string;
}

const BandwidthPage = ({ used, total, unit = "Mbps", className }: BandwidthCardProps) => {
  const percentage = Math.round((used / total) * 100);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          <Link to="/dashboard/bandwidth" className="hover:underline">Bandwidth</Link>
        </CardTitle>
        <Cpu className="text-gray-500" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <p className="text-4xl font-bold">{used} {unit}</p>
        <p className="text-sm text-gray-500 mt-1">of {total} {unit} total</p>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
          <div
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BandwidthPage;

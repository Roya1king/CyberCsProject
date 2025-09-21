import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const sampleData = [
  { time: "12:00", count: 120 },
  { time: "12:05", count: 180 },
  { time: "12:10", count: 150 },
  { time: "12:15", count: 210 },
  { time: "12:20", count: 190 },
  { time: "12:25", count: 250 },
];

interface PacketCountProps { className?: string }

const PacketCountChart = ({ className }: PacketCountProps) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>
          <Link to="/dashboard/packet-count" className="hover:underline">Packet Count</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacketCountChart;



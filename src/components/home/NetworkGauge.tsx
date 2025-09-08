import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

interface NetworkGaugeProps {
  value: number; // 0 to 100
}

const NetworkGauge = ({ value }: NetworkGaugeProps) => {
  const data = [
    { name: "Used", value },
    { name: "Remaining", value: 100 - value },
  ];

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
    <Card className="w-64">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Network Status</CardTitle>
        <Network className="text-gray-500" />
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <PieChart width={160} height={80}>
          <Pie
            startAngle={180}
            endAngle={0}
            data={data}
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            <Cell key="used" fill={color} />
            <Cell key="remaining" fill="#e5e7eb" />
          </Pie>
        </PieChart>
        <div className="mt-2 text-center">
          <p className="text-xl font-semibold">{status}</p>
          <p className="text-sm text-gray-500">{value}% Strength</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkGauge;

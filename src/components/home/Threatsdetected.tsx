import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldAlert } from "lucide-react";

const ThreatsDetected = () => {
  const threats = [
    { time: "12:30:01", source: "192.168.0.10", target: "192.168.0.5", type: "Malware", severity: "High", status: "Blocked" },
    { time: "12:31:15", source: "192.168.0.11", target: "192.168.0.6", type: "Port Scan", severity: "Medium", status: "Alerted" },
    { time: "12:32:40", source: "192.168.0.12", target: "192.168.0.7", type: "Brute Force", severity: "High", status: "Blocked" },
    { time: "12:33:22", source: "192.168.0.13", target: "192.168.0.8", type: "Malware", severity: "Low", status: "Mitigated" },
    { time: "12:34:05", source: "192.168.0.14", target: "192.168.0.9", type: "Port Scan", severity: "Medium", status: "Alerted" },
  ];

  const severityColor = (severity: string) => {
    switch (severity) {
      case "High": return "text-red-500";
      case "Medium": return "text-yellow-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Card className="w-[30%]">
      <CardHeader className="flex items-center gap-2">
        <ShieldAlert className="text-red-500" />
        <CardTitle>Threats Detected</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Target IP</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threats.map((t, idx) => (
                <TableRow key={idx} className="text-sm">
                  <TableCell>{t.time}</TableCell>
                  <TableCell>{t.source}</TableCell>
                  <TableCell>{t.target}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell className={severityColor(t.severity)}>{t.severity}</TableCell>
                  <TableCell>{t.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatsDetected;

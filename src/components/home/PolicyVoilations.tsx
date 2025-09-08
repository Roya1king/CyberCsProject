import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

const PolicyViolations = () => {
  const violations = [
    { time: "12:15:02", user: "user1", url: "example.com", method: "VPN", status: "Blocked" },
    { time: "12:17:45", user: "user2", url: "socialsite.com", method: "Proxy", status: "Blocked" },
    { time: "12:20:11", user: "user3", url: "gamingsite.net", method: "Tor", status: "Alerted" },
    { time: "12:22:30", user: "user4", url: "streaming.com", method: "VPN", status: "Blocked" },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case "Blocked":
        return "text-red-500";
      case "Alerted":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="w-[40%]">
      <CardHeader className="flex items-center gap-2">
        <AlertTriangle className="text-red-500" />
        <CardTitle>Policy Violations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User/IP</TableHead>
                <TableHead>Blocked URL</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violations.map((v, idx) => (
                <TableRow key={idx} className="text-sm">
                  <TableCell>{v.time}</TableCell>
                  <TableCell>{v.user}</TableCell>
                  <TableCell>{v.url}</TableCell>
                  <TableCell>{v.method}</TableCell>
                  <TableCell className={statusColor(v.status)}>{v.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyViolations;

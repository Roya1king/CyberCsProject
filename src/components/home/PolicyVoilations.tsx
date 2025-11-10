// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Link } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { AlertTriangle } from "lucide-react";

// const PolicyViolations = () => {
//   const violations = [
//     { time: "12:15:02", user: "user1", url: "example.com", method: "VPN", status: "Blocked" },
//     { time: "12:17:45", user: "user2", url: "socialsite.com", method: "Proxy", status: "Blocked" },
//     { time: "12:20:11", user: "user3", url: "gamingsite.net", method: "Tor", status: "Alerted" },
//     { time: "12:22:30", user: "user4", url: "streaming.com", method: "VPN", status: "Blocked" },
//   ];

//   const statusColor = (status: string) => {
//     switch (status) {
//       case "Blocked":
//         return "text-red-500";
//       case "Alerted":
//         return "text-yellow-500";
//       default:
//         return "text-gray-500";
//     }
//   };

//   const APIdata = async () => {
//     try {
//       const response = await fetch("ws://localhost:8000/api/security-alerts")
//       if(!response) return
//       const jsonData = await response.json()
//       console.log(jsonData)
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   APIdata()

//   return (
//     <Card className="w-full mt-100">
//       <CardHeader className="flex items-center gap-2">
//         <AlertTriangle className="text-red-500" />
//         <CardTitle>
//           <Link to="/dashboard/policy-violations" className="hover:underline">Policy Violations</Link>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Time</TableHead>
//                 <TableHead>User/IP</TableHead>
//                 <TableHead>Blocked URL</TableHead>
//                 <TableHead>Method</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {violations.map((v, idx) => (
//                 <TableRow key={idx} className="text-sm">
//                   <TableCell>{v.time}</TableCell>
//                   <TableCell>{v.user}</TableCell>
//                   <TableCell>{v.url}</TableCell>
//                   <TableCell>{v.method}</TableCell>
//                   <TableCell className={statusColor(v.status)}>{v.status}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PolicyViolations;
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AlertItem {
  id: number;
  timestamp: string;
  signature: string;
  severity: number;
  protocol: string;
  src_ip: string;
  src_port?: number | null;
  dest_ip: string;
  dest_port?: number | null;
}

const PolicyViolations: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/security-alerts/");
        if (!response.ok) throw new Error("Failed to fetch alerts");
        const jsonData = await response.json();
        setAlerts(jsonData.alerts || []);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Optional: auto-refresh every 10 seconds
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  // Format date/time
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Severity color mapping
  const severityColor = (sev: number) => {
    switch (sev) {
      case 1:
        return "bg-green-600/20 text-green-400";
      case 2:
        return "bg-yellow-600/20 text-yellow-400";
      case 3:
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-600/20 text-gray-300";
    }
  };

  return (
    <Card className="w-full bg-[#111827] border border-white/10 shadow-md rounded-2xl">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" />
          <CardTitle className="text-gray-100 font-semibold">
            <Link to="/dashboard/policy-violations" className="hover:underline">
              Policy Violations
            </Link>
          </CardTitle>
        </div>
        <Badge className="bg-blue-600/20 text-blue-400">
          Total: {alerts.length || 0}
        </Badge>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-400 py-6">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="text-center text-gray-400 py-6">
            No policy violations detected.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">Time</TableHead>
                <TableHead className="text-gray-400">Signature</TableHead>
                <TableHead className="text-gray-400">Protocol</TableHead>
                <TableHead className="text-gray-400">Severity</TableHead>
                <TableHead className="text-gray-400">Source</TableHead>
                <TableHead className="text-gray-400">Destination</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="text-sm hover:bg-[#1f2937]/70">
                  <TableCell className="text-gray-300">{formatDate(alert.timestamp)}</TableCell>
                  <TableCell className="text-gray-200">{alert.signature}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        alert.protocol === "ICMP"
                          ? "bg-blue-600/20 text-blue-400"
                          : alert.protocol === "TCP"
                          ? "bg-purple-600/20 text-purple-400"
                          : "bg-green-600/20 text-green-400"
                      }`}
                    >
                      {alert.protocol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={severityColor(alert.severity)}>
                      {alert.severity === 3
                        ? "High"
                        : alert.severity === 2
                        ? "Medium"
                        : "Low"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {alert.src_ip}
                    {alert.src_port && `:${alert.src_port}`}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {alert.dest_ip}
                    {alert.dest_port && `:${alert.dest_port}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyViolations;

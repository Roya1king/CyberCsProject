
// import React, { useEffect, useState } from "react";
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
// import { Badge } from "@/components/ui/badge";

// interface AlertItem {
//   id: number;
//   timestamp: string;
//   signature: string;
//   severity: number;
//   protocol: string;
//   src_ip: string;
//   src_port?: number | null;
//   dest_ip: string;
//   dest_port?: number | null;
// }

// const PolicyViolations: React.FC = () => {
//   const [alerts, setAlerts] = useState<AlertItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAlerts = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/security-alerts/");
//         if (!response.ok) throw new Error("Failed to fetch alerts");
//         const jsonData = await response.json();
//         setAlerts(jsonData.alerts || []);
//       } catch (error) {
//         console.error("Error fetching alerts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAlerts();
//     const interval = setInterval(fetchAlerts, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const formatDate = (timestamp: string) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString("en-IN", {
//       hour12: false,
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//   };

//   const severityColor = (sev: number) => {
//     switch (sev) {
//       case 1:
//         return "bg-green-600/20 text-green-400";
//       case 2:
//         return "bg-yellow-600/20 text-yellow-400";
//       case 3:
//         return "bg-red-600/20 text-red-400";
//       default:
//         return "bg-gray-600/20 text-gray-300";
//     }
//   };

//   return (
//     <Card className="w-full bg-[#111827] border border-white/10 shadow-md rounded-2xl">
//       <CardHeader className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <AlertTriangle className="text-red-500" />
//           <CardTitle className="text-gray-100 font-semibold">
//             <Link to="/dashboard/policy-violations" className="hover:underline">
//               Policy Violations
//             </Link>
//           </CardTitle>
//         </div>
//         <Badge className="bg-blue-600/20 text-blue-400">
//           Total: {alerts.length || 0}
//         </Badge>
//       </CardHeader>

//       <CardContent className="p-0 overflow-x-auto">
//         {loading ? (
//           <p className="text-center text-gray-400 py-6">Loading alerts...</p>
//         ) : alerts.length === 0 ? (
//           <p className="text-center text-gray-400 py-6">
//             No policy violations detected.
//           </p>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-gray-400">Time</TableHead>
//                 <TableHead className="text-gray-400">Signature</TableHead>
//                 <TableHead className="text-gray-400">Protocol</TableHead>
//                 <TableHead className="text-gray-400">Severity</TableHead>
//                 <TableHead className="text-gray-400">Source IP</TableHead>
//                 <TableHead className="text-gray-400">Source Port</TableHead>
//                 <TableHead className="text-gray-400">Destination IP</TableHead>
//                 <TableHead className="text-gray-400">Destination Port</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {alerts.map((alert) => (
//                 <TableRow key={alert.id} className="text-sm hover:bg-[#1f2937]/70">
//                   <TableCell className="text-gray-300">{formatDate(alert.timestamp)}</TableCell>
//                   <TableCell className="text-gray-200">{alert.signature}</TableCell>
//                   <TableCell>
//                     <Badge
//                       className={`${
//                         alert.protocol === "ICMP"
//                           ? "bg-blue-600/20 text-blue-400"
//                           : alert.protocol === "TCP"
//                           ? "bg-purple-600/20 text-purple-400"
//                           : "bg-green-600/20 text-green-400"
//                       }`}
//                     >
//                       {alert.protocol}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={severityColor(alert.severity)}>
//                       {alert.severity === 3
//                         ? "High"
//                         : alert.severity === 2
//                         ? "Medium"
//                         : "Low"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-gray-300">{alert.src_ip}</TableCell>
//                   <TableCell className="text-gray-300">
//                     {alert.src_port ?? "—"}
//                   </TableCell>
//                   <TableCell className="text-gray-300">{alert.dest_ip}</TableCell>
//                   <TableCell className="text-gray-300">
//                     {alert.dest_port ?? "—"}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PolicyViolations;
import React, { useEffect, useState, useRef } from "react";
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

// IMPORTANT: Assume this function is imported from your toast library (e.g., sonner, react-hot-toast)
// You must adjust the 'toast' implementation to use the 'toastClass' provided in the options.

// Mock toast function updated to show how the class would be used
const toast = (title: string, options: any) => {
    // In a real implementation (e.g., using sonner), you would pass options.className
    // or options.style to customize the toast's background/text color based on the severity.
    console.log(`[TOAST] ${title} - Severity Class: ${options.toastClass}`);
}; 


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
  
  const lastAlertTimestamp = useRef<string | null>(null);

  // Function to return the color/class based on severity
  const severityColor = (sev: number) => {
    switch (sev) {
      case 1:
        return "bg-green-600/20 text-green-400"; // Low
      case 2:
        return "bg-yellow-600/20 text-yellow-400"; // Medium
      case 3:
        return "bg-red-600/20 text-red-400"; // High
      default:
        return "bg-gray-600/20 text-gray-300";
    }
  };
  
  // Helper function to show a custom toast notification with color
  const notifyNewAlert = (alert: AlertItem) => {
    const severityText = alert.severity === 3 ? "High" : alert.severity === 2 ? "Medium" : "Low";
    const colorClass = severityColor(alert.severity); // Get the matching color class

    toast(`${severityText} Policy Violation Detected! 🚨`, {
      description: `${alert.signature} | ${alert.src_ip} -> ${alert.dest_ip} (${alert.protocol})`,
      duration: 5000,
      // Pass the color class as an option (you map this in your Toaster component)
      toastClass: colorClass, 
      // Example of how to use it with sonner's classNames:
      // className: colorClass.replace('/20', '').replace('text-', 'border '), // Might need adjustment
    });
  };


  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/security-alerts/");
      if (!response.ok) throw new Error("Failed to fetch alerts");
      const jsonData = await response.json();
      const newAlerts: AlertItem[] = jsonData.alerts || [];

      // --- TOAST LOGIC ---
      if (newAlerts.length > 0) {
        // Assuming the backend returns alerts sorted by timestamp descending,
        // we'll find the last element if it's sorted ascending, or the first if descending.
        // For robustness, let's find the absolute latest timestamp:
        const mostRecentAlert = newAlerts.reduce((latest, current) => 
            new Date(current.timestamp).getTime() > new Date(latest.timestamp).getTime() ? current : latest
        , newAlerts[0]); 

        // Initial load check
        if (lastAlertTimestamp.current === null) {
          lastAlertTimestamp.current = mostRecentAlert.timestamp;
        } else {
          const lastSeenTime = new Date(lastAlertTimestamp.current).getTime();
          const newAlertTime = new Date(mostRecentAlert.timestamp).getTime();

          if (newAlertTime > lastSeenTime) {
            // Filter and notify for all new alerts since the last check
            const incomingAlerts = newAlerts.filter(alert => 
                new Date(alert.timestamp).getTime() > lastSeenTime
            );

            // Notify for each new alert
            // We notify them in the order they arrived (ascending time)
            incomingAlerts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                          .forEach(alert => notifyNewAlert(alert));

            // Update the last seen timestamp to the latest one
            lastAlertTimestamp.current = mostRecentAlert.timestamp;
          }
        }
      }
      // --- END TOAST LOGIC ---

      setAlerts(newAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // The severityColor function is already defined and used in notifyNewAlert

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
                <TableHead className="text-gray-400">Source IP</TableHead>
                <TableHead className="text-gray-400">Source Port</TableHead>
                <TableHead className="text-gray-400">Destination IP</TableHead>
                <TableHead className="text-gray-400">Destination Port</TableHead>
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
                          : "bg-green-600/20 text-green-400" // Default for other protocols
                      }`}
                    >
                      {alert.protocol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* Applying the color class to the severity badge in the table */}
                    <Badge className={severityColor(alert.severity)}>
                      {alert.severity === 3
                        ? "High"
                        : alert.severity === 2
                        ? "Medium"
                        : "Low"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{alert.src_ip}</TableCell>
                  <TableCell className="text-gray-300">
                    {alert.src_port ?? "—"}
                  </TableCell>
                  <TableCell className="text-gray-300">{alert.dest_ip}</TableCell>
                  <TableCell className="text-gray-300">
                    {alert.dest_port ?? "—"}
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
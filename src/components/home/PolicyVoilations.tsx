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
import AlertDetailModal from "./AlertDetailModal";

// Replace with your actual toast import
const toast = (title: string, options: any) => {
    console.log(`[TOAST] ${title}`);
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
  raw_alert: any;
}

const PolicyViolations: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lastAlertTimestamp = useRef<string | null>(null);

  // Modal State
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ FIXED: 1 = High (Red), 3 = Low (Green)
  const severityColor = (sev: number) => {
    switch (sev) {
      case 1: return "bg-red-600/20 text-red-400 border-red-600/30";
      case 2: return "bg-orange-600/20 text-orange-400 border-orange-600/30";
      case 3: return "bg-green-600/20 text-green-400 border-green-600/30";
      default: return "bg-blue-600/20 text-blue-400 border-blue-600/30";
    }
  };

  const getSeverityLabel = (sev: number) => {
      if (sev === 1) return "High";
      if (sev === 2) return "Med";
      if (sev === 3) return "Low";
      return "Info";
  };

  const notifyNewAlert = (alert: AlertItem) => {
    const label = getSeverityLabel(alert.severity);
    toast(`${label} Policy Violation Detected!`, { description: alert.signature });
  };

  const fetchAlerts = async () => {
    try {
      // Fetch strictly Policy type
      const response = await fetch("http://localhost:8000/api/security-alerts/?type=policy");
      if (!response.ok) throw new Error("Failed to fetch alerts");
      const jsonData = await response.json();
      const newAlerts: AlertItem[] = jsonData.alerts || [];

      if (newAlerts.length > 0) {
        const latestTime = newAlerts[0].timestamp;
        if (lastAlertTimestamp.current) {
           const lastSeen = new Date(lastAlertTimestamp.current).getTime();
           // Notify for newer alerts
           newAlerts.forEach(alert => {
               if (new Date(alert.timestamp).getTime() > lastSeen) notifyNewAlert(alert);
           });
        }
        lastAlertTimestamp.current = latestTime;
      }
      setAlerts(newAlerts);
    } catch (error) {
      console.error("Error fetching policy alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };

  return (
    <>
      <AlertDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        alert={selectedAlert} 
      />

      <Card className="w-full bg-[#111827] border border-white/10 shadow-md rounded-2xl">
        <CardHeader className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" />
            <CardTitle className="text-gray-100 font-semibold">
              <Link to="/dashboard/policy-violations" className="hover:underline">
                Policy Violations
              </Link>
            </CardTitle>
          </div>
          <Badge className="bg-blue-600/20 text-blue-400">Total: {alerts.length}</Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading...</p>
          ) : alerts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No policy violations detected.</p>
          ) : (
            <Table>
              <TableHeader className="bg-gray-900/50">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400">Time</TableHead>
                  <TableHead className="text-gray-400">Signature</TableHead>
                  <TableHead className="text-gray-400">Severity</TableHead>
                  <TableHead className="text-gray-400">Protocol</TableHead>
                  <TableHead className="text-gray-400">Source</TableHead>
                  <TableHead className="text-gray-400">Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow 
                    key={alert.id} 
                    className="text-sm border-white/5 hover:bg-[#1f2937] cursor-pointer transition-colors"
                    onClick={() => { setSelectedAlert(alert); setIsModalOpen(true); }}
                  >
                    <TableCell className="text-gray-300 font-mono text-xs">{formatDate(alert.timestamp)}</TableCell>
                    <TableCell className="text-gray-200 font-medium">{alert.signature}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={severityColor(alert.severity)}>
                            {getSeverityLabel(alert.severity)}
                        </Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-gray-400 border-gray-700">{alert.protocol}</Badge></TableCell>
                    <TableCell className="text-gray-300 text-xs">{alert.src_ip}</TableCell>
                    <TableCell className="text-gray-300 text-xs">{alert.dest_ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PolicyViolations;
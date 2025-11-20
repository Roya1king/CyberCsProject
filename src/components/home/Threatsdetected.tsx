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
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AlertDetailModal from "./AlertDetailModal";

// Replace with your real toast
const toast = (title: string, options: any) => {
  console.log(`[TOAST] ${title}`, options);
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

const ThreatsDetected = () => {
  const [threats, setThreats] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lastThreatTimestamp = useRef<string | null>(null);

  // Modal
  const [selectedThreat, setSelectedThreat] = useState<AlertItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Same color pattern as Policy Violations
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

  const notifyNewThreat = (threat: AlertItem) => {
    const label = getSeverityLabel(threat.severity);
    toast(`${label} Threat Detected!`, { description: threat.signature });
  };

  const fetchThreats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/security-alerts/?type=threat");
      if (!response.ok) throw new Error("Failed to fetch threats");

      const data = await response.json();
      const newThreats: AlertItem[] = data.alerts || [];

      // Detect & toast NEW threats
      if (newThreats.length > 0) {
        const latestTime = newThreats[0].timestamp;

        if (lastThreatTimestamp.current) {
          const lastSeen = new Date(lastThreatTimestamp.current).getTime();

          newThreats.forEach(threat => {
            if (new Date(threat.timestamp).getTime() > lastSeen) {
              notifyNewThreat(threat);
            }
          });
        }
        lastThreatTimestamp.current = latestTime;
      }

      setThreats(newThreats);
    } catch (err) {
      console.error("Error fetching threats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString("en-IN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <>
      <AlertDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={selectedThreat}
      />

      <Card className="w-full bg-[#111827] border border-white/10 shadow-md rounded-2xl mt-6">
        <CardHeader className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500" />
            <CardTitle className="text-gray-100 font-semibold">
              <Link to="/dashboard/threats" className="hover:underline">
                Threats Detected
              </Link>
            </CardTitle>
          </div>

          <Badge className="bg-red-600/20 text-red-400 border-red-700/40">
            Active: {threats.length}
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Scanning network...</p>
          ) : threats.length === 0 ? (
            <p className="text-center text-green-500 py-8">No active threats detected.</p>
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
                {threats.map((t) => (
                  <TableRow
                    key={t.id}
                    className="text-sm border-white/5 hover:bg-[#1f2937] cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedThreat(t);
                      setIsModalOpen(true);
                    }}
                  >
                    <TableCell className="text-gray-300 font-mono text-xs">
                      {formatDate(t.timestamp)}
                    </TableCell>

                    <TableCell className="text-gray-200 font-medium">
                      {t.signature}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={severityColor(t.severity)}>
                        {getSeverityLabel(t.severity)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-gray-400 border-gray-700">
                        {t.protocol}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-gray-300 text-xs">{t.src_ip}</TableCell>
                    <TableCell className="text-gray-300 text-xs">{t.dest_ip}</TableCell>
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

export default ThreatsDetected;

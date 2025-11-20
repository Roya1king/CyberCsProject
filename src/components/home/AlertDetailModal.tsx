import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Terminal, Activity, Globe, Clock } from "lucide-react";

interface AlertDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: any;
}

const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ isOpen, onClose, alert }) => {
  if (!alert) return null;

  // Safe JSON parsing
  let rawData = {};
  try {
      rawData = typeof alert.raw_alert === "string" ? JSON.parse(alert.raw_alert) : alert.raw_alert;
  } catch (e) {
      rawData = { error: "Could not parse raw data" };
  }
  
  // ✅ FIXED: IDS Severity Scale (1 = Critical, 3 = Low)
  const getSeverityStyle = (sev: number) => {
    switch (sev) {
      case 1: return "bg-red-900/50 text-red-400 border-red-700";    // High
      case 2: return "bg-orange-900/50 text-orange-400 border-orange-700"; // Medium
      case 3: return "bg-green-900/50 text-green-400 border-green-700";  // Low
      default: return "bg-blue-900/50 text-blue-400 border-blue-700";   // Info
    }
  };

  const getSeverityLabel = (sev: number) => {
      if (sev === 1) return "High";
      if (sev === 2) return "Medium";
      if (sev === 3) return "Low";
      return "Info";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1f2937] border-white/10 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* --- Header --- */}
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <DialogTitle className="text-xl font-bold leading-tight">{alert.signature}</DialogTitle>
            </div>
            <Badge variant="outline" className={`${getSeverityStyle(alert.severity)} px-3 py-1 whitespace-nowrap`}>
              Severity: {getSeverityLabel(alert.severity)}
            </Badge>
          </div>
          <DialogDescription className="text-gray-400 flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" /> {new Date(alert.timestamp).toLocaleString()} 
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/10 my-2" />

        {/* --- Network Flow Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/20 rounded-lg border border-white/5">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">Source</p>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-blue-300">{alert.src_ip}</span>
              <span className="text-gray-500">:</span>
              <span className="text-yellow-300">{alert.src_port || "N/A"}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">Destination</p>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-blue-300">{alert.dest_ip}</span>
              <span className="text-gray-500">:</span>
              <span className="text-yellow-300">{alert.dest_port || "N/A"}</span>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 mt-2 pt-2 border-t border-white/5">
             <div className="text-sm text-gray-400">Protocol: <span className="text-white font-mono">{alert.protocol}</span></div>
             {/* @ts-ignore */}
             <div className="text-sm text-gray-400">Flow ID: <span className="text-white font-mono">{rawData?.flow_id || "N/A"}</span></div>
          </div>
        </div>

        {/* --- Rule Details --- */}
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Suricata Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 bg-black/20 p-3 rounded border border-white/5">
               {/* @ts-ignore */}
               <p>SID: <span className="text-gray-200">{rawData?.alert?.signature_id || "N/A"}</span></p>
               {/* @ts-ignore */}
               <p>Category: <span className="text-gray-200">{rawData?.alert?.category || "N/A"}</span></p>
               {/* @ts-ignore */}
               <p>Action: <span className="text-red-300 font-bold uppercase">{rawData?.alert?.action || "Allowed"}</span></p>
               {/* @ts-ignore */}
               <p>Interface: <span className="text-gray-200">{rawData?.in_iface || "N/A"}</span></p>
            </div>
          </div>

          {/* --- Raw Payload --- */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">Raw Log Payload</h4>
            <pre className="bg-[#0d1117] text-green-500 p-3 rounded-md text-xs font-mono overflow-x-auto border border-white/10 max-h-40 scrollbar-thin scrollbar-thumb-gray-700">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5 text-gray-300 hover:text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailModal;
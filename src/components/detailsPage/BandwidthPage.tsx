import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Network } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Packet {
  source_ip: string;
  destination_ip: string;
  packet_length: number;
  protocol: string;
}

interface BandwidthCardProps {
  total: number;
  className?: string;
}

const BandwidthCard = ({ total, className }: BandwidthCardProps) => {
  const [bandwidth, setBandwidth] = useState(0);
  const newLength = useRef(0);
  const oldBandwidth = useRef(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");
    ws.onmessage = (event) => {
      try {
        const pkt: Packet = JSON.parse(event.data);
        newLength.current += pkt.packet_length;
      } catch (err) {
        console.error("Invalid packet:", err);
      }
    };
    ws.onopen = () => console.log("WebSocket connected ✅");
    ws.onclose = () => console.log("WebSocket disconnected ❌");
    return () => ws.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      oldBandwidth.current = (newLength.current / 1024 / 1024) * 8;
      setBandwidth(oldBandwidth.current);
      newLength.current = 0;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const percentage = Math.min(100, Math.round((bandwidth / total) * 100));

  const getStatusLabel = (val: number) => {
    if (val < 30) return "Weak";
    if (val < 70) return "Moderate";
    return "Strong";
  };

  const statusColor =
    percentage < 30
      ? "text-red-400"
      : percentage < 70
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <Card
      className={cn(
        "w-full h-full bg-[#0b1220] text-white flex flex-col justify-between p-4",
        className
      )}
    >
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="text-sm font-medium text-gray-300">
          Network Status
        </CardTitle>
        <Network className="w-5 h-5 text-gray-400" />
      </CardHeader>

      <CardContent className="flex flex-col justify-center flex-1 text-center p-0 mt-2">
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>

        <p className="text-4xl font-bold mt-3">{percentage}%</p>

        <p className={cn("text-sm font-medium mt-1", statusColor)}>
          {getStatusLabel(percentage)}
        </p>
        <p className="text-xs text-gray-400">Network strength</p>
      </CardContent>
    </Card>
  );
};

export default BandwidthCard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";
import { Link } from "react-router-dom";
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

  return (
    <Card className={cn("w-full h-full flex flex-col justify-between", className)}>
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          <Link to="/dashboard/bandwidth" className="hover:underline">
            Bandwidth Usage
          </Link>
        </CardTitle>
        <Cpu className="w-5 h-5 text-gray-500" />
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center text-center space-y-2">
        <p className="text-3xl font-bold leading-tight">{bandwidth.toFixed(2)} Mbps</p>
        <p className="text-xs text-gray-500">of {total} Mbps total</p>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
          <div
            className="bg-blue-500 h-2 transition-all duration-500 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-1">{percentage}% used</p>
      </CardContent>
    </Card>
  );
};

export default BandwidthCard;

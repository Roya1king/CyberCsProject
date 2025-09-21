import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface Packet {
  source_ip: string;
  destination_ip: string;
  packet_length: number; // Length of the packet in bytes
  protocol: string;
}

interface BandwidthCardProps {
  total: number; // Total bandwidth capacity in Mbps
  className?: string;
}

const BandwidthCard = ({ total, className }: BandwidthCardProps) => {
  const [bandwidth, setBandwidth] = useState(0); // Bandwidth in Mbps
  const newLength = useRef(0); // Tracks the total length of packets in the current minute
  const oldBandwidth = useRef(0); // Tracks the bandwidth of the last minute

  useEffect(() => {
    // Connect WebSocket (replace with your server URL)
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      try {
        const pkt: Packet = JSON.parse(event.data);

        // Increment the total length of packets in the current minute
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
    // Update bandwidth every minute
    const interval = setInterval(() => {
      // Calculate bandwidth in Mbps
      oldBandwidth.current = (newLength.current / 60 / 1024 / 1024) * 8; // Convert bytes to Mbps
      setBandwidth(oldBandwidth.current);

      // Reset the total length for the next minute
      newLength.current = 0;
    }, 60 * 1000); // Every 1 minute

    return () => clearInterval(interval);
  }, []);

  const percentage = Math.round((bandwidth / total) * 100);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          <Link to="/dashboard/bandwidth" className="hover:underline">Bandwidth</Link>
        </CardTitle>
        <Cpu className="text-gray-500" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <p className="text-4xl font-bold">{bandwidth.toFixed(2)} Mbps</p>
        <p className="text-sm text-gray-500 mt-1">of {total} Mbps total</p>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
          <div
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BandwidthCard;

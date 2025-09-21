import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface Packet {
  source_ip: string;
  destination_ip: string;
  packet_length: number; // Length of the packet in bytes
  protocol: string;
}

interface PacketCountProps {
  className?: string;
}

const PacketCountChart = ({ className }: PacketCountProps) => {
  const [chartData, setChartData] = useState<{ time: string; count: number }[]>([]);
  const newCnt = useRef(0); // Tracks packets in the current minute
  const oldCnt = useRef(0); // Tracks packets in the last minute

  useEffect(() => {
    // Connect WebSocket (replace with your server URL)
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      try {
        const pkt: Packet = JSON.parse(event.data);

        // Increment the new packet count
        if (pkt.packet_length) {
          newCnt.current += 1; // Count the packet
        }
      } catch (err) {
        console.error("Invalid packet:", err);
      }
    };

    ws.onopen = () => console.log("WebSocket connected ✅");
    ws.onclose = () => console.log("WebSocket disconnected ❌");

    return () => ws.close();
  }, []);

  useEffect(() => {
    // Update chart data every minute
    const interval = setInterval(() => {
      // Update old count with the new count
      oldCnt.current = newCnt.current;

      // Reset new count
      newCnt.current = 0;

      // Add the old count to the chart data
      const now = new Date();
      setChartData((prev) => [
        ...prev.slice(-9), // Keep the last 9 data points (10 total)
        { time: now.toLocaleTimeString(), count: oldCnt.current },
      ]);
    }, 60 * 1000); // Every 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>
          <Link to="/dashboard/packet-count" className="hover:underline">Packet Count</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacketCountChart;



import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Packet {
  source_ip: string;
  destination_ip: string;
  packet_length: number;
  protocol: string;
}

interface PacketCountProps {
  className?: string;
}

const PacketCountChart = ({ className }: PacketCountProps) => {
  const [historyData, setHistoryData] = useState<{ time: string; count: number }[]>([]);
  const [viewOffset, setViewOffset] = useState(0);
  const [currentSecondCount, setCurrentSecondCount] = useState(0);
  const liveCounter = useRef(0);

  const WINDOW_SIZE = 10; // number of visible bars at a time

  // --- WebSocket Connection ---
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");

    ws.onmessage = (event) => {
      try {
        const pkt: Packet = JSON.parse(event.data);
        if (pkt.packet_length) {
          liveCounter.current += 1;
          setCurrentSecondCount(liveCounter.current);
        }
      } catch (err) {
        console.error("Invalid packet:", err);
      }
    };

    ws.onopen = () => console.log("PacketCountChart: WebSocket connected ✅");
    ws.onclose = () => console.log("PacketCountChart: WebSocket disconnected ❌");
    return () => ws.close();
  }, []);

  // --- Update data every second ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        count: liveCounter.current,
      };

      liveCounter.current = 0; // reset after logging

      setHistoryData((prev) => {
        const updated = [...prev, newPoint];
        return updated.length > 300 ? updated.slice(-300) : updated; // keep ~5 minutes of data
      });

      // Auto-scroll only if user is at live edge
      if (viewOffset + WINDOW_SIZE >= historyData.length) {
        setViewOffset(Math.max(0, historyData.length - WINDOW_SIZE));
      }

      setCurrentSecondCount(0);
    }, 1000);

    return () => clearInterval(interval);
  }, [viewOffset, historyData.length]);

  // --- Data slice for visible window ---
  const visibleData = useMemo(() => {
    return historyData.slice(viewOffset, viewOffset + WINDOW_SIZE);
  }, [historyData, viewOffset]);

  // --- Handlers for navigation ---
  const handlePrev = () => setViewOffset((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setViewOffset((prev) => Math.min(historyData.length - WINDOW_SIZE, prev + 1));

  const isAtStart = viewOffset === 0;
  const isAtEnd = viewOffset + WINDOW_SIZE >= historyData.length;

  return (
    <Card className={cn("w-full min-h-[420px] p-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Link to="/dashboard/packet-count" className="hover:underline">
            Packet Count (per sec)
          </Link>
        </CardTitle>
        <span className="text-3xl font-bold">{currentSecondCount}</span>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-2">
          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            disabled={isAtStart}
            className={`p-2 rounded-md border ${
              isAtStart
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-muted transition-colors"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm text-muted-foreground">
            Viewing:{" "}
            {visibleData.length > 0
              ? `${visibleData[0].time} → ${
                  visibleData[visibleData.length - 1].time
                }`
              : "---"}
          </span>

          <button
            onClick={handleNext}
            disabled={isAtEnd}
            className={`p-2 rounded-md border ${
              isAtEnd
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-muted transition-colors"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bar Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visibleData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value) => [`${value} Packets`, "Count"]}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacketCountChart;

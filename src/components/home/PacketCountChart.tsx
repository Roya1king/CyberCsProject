// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Link } from "react-router-dom";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { cn } from "@/lib/utils";
// import { useState, useEffect, useRef } from "react";

// interface Packet {
//   source_ip: string;
//   destination_ip: string;
//   packet_length: number; // Length of the packet in bytes
//   protocol: string;
// }

// interface PacketCountProps {
//   className?: string;
// }

// const PacketCountChart = ({ className }: PacketCountProps) => {
//   const [chartData, setChartData] = useState<{ time: string; count: number }[]>([]);
//   const newCnt = useRef(0); // Tracks packets in the current minute
//   const oldCnt = useRef(0); // Tracks packets in the last minute

//   useEffect(() => {
//     // Connect WebSocket (replace with your server URL)
//     const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");

//     ws.onmessage = (event) => {
//       try {
//         const pkt: Packet = JSON.parse(event.data);

//         // Increment the new packet count
//         if (pkt.packet_length) {
//           newCnt.current += 1; // Count the packet
//         }
//       } catch (err) {
//         console.error("Invalid packet:", err);
//       }
//     };

//     ws.onopen = () => console.log("WebSocket connected ✅");
//     ws.onclose = () => console.log("WebSocket disconnected ❌");

//     return () => ws.close();
//   }, []);

//   useEffect(() => {
//     // Update chart data every minute
//     const interval = setInterval(() => {
//       // Update old count with the new count
//       oldCnt.current = newCnt.current;

//       // Reset new count
//       newCnt.current = 0;

//       // Add the old count to the chart data
//       const now = new Date();
//       setChartData((prev) => [
//         ...prev.slice(-9), // Keep the last 9 data points (10 total)
//         { time: now.toLocaleTimeString(), count: oldCnt.current },
//       ]);
//     },  1000); // Every 1 minute

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Card className={cn("w-full", className)}>
//       <CardHeader>
//         <CardTitle>
//           <Link to="/dashboard/packet-count" className="hover:underline">Packet Count</Link>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="h-48">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
//               <XAxis dataKey="time" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PacketCountChart;


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo } from "react";
import { BarChart3 } from "lucide-react";

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
  const [currentSecondCount, setCurrentSecondCount] = useState(0);
  const [viewOffset, setViewOffset] = useState(0);
  const livePacketCounter = useRef(0);

  const WINDOW_SIZE = 10;

  // --- WebSocket: Live packet counting ---
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");
    ws.onmessage = (event) => {
      try {
        const pkt: Packet = JSON.parse(event.data);
        if (pkt.packet_length) {
          livePacketCounter.current += 1;
          setCurrentSecondCount(livePacketCounter.current);
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
      const countForSecond = livePacketCounter.current;
      livePacketCounter.current = 0;
      setCurrentSecondCount(0);

      const now = new Date();

      setHistoryData((prev) => {
        const newPoint = {
          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          count: countForSecond,
        };
        const newData = [...prev, newPoint];

        const maxOffset = Math.max(0, newData.length - WINDOW_SIZE);
        if (viewOffset + WINDOW_SIZE >= prev.length) {
          setViewOffset(maxOffset);
        }

        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [viewOffset]);

  // --- Visible data slice ---
  const visibleChartData = useMemo(() => {
    return historyData.slice(viewOffset, viewOffset + WINDOW_SIZE);
  }, [historyData, viewOffset]);

  // --- Slider control ---
  const handleSliderChange = (newOffset: number) => {
    setViewOffset(newOffset);
  };

  const maxSliderValue = Math.max(0, historyData.length - WINDOW_SIZE);
  const currentSliderValue = viewOffset;

  return (
    <Card className={cn("w-full min-h-[420px] p-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <Link to="/dashboard/packet-count" className="hover:underline">
            Packet Count (per sec)
          </Link>
        </CardTitle>
        <span className="text-3xl font-bold">{currentSecondCount}</span>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visibleChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                label={{
                  value: "Time Bucket (HH:MM:SS)",
                  position: "bottom",
                  offset: 0,
                  fill: "#ccc",
                  fontSize: 10,
                }}
              />

              <YAxis
                tick={{ fontSize: 10 }}
                label={{
                  value: "Packet Count",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#ccc",
                  fontSize: 10,
                }}
              />

              <Tooltip
                labelFormatter={(label) => `Time Bucket: ${label}`}
                formatter={(value) => [`${value} Packets`, "Volume"]}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCount)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Slider */}
        <div className="pt-4 flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-400">
            Viewing:{" "}
            {visibleChartData.length > 0 ? visibleChartData[0].time : "---"} to{" "}
            {visibleChartData.length > 0
              ? visibleChartData[visibleChartData.length - 1].time
              : "---"}
          </span>

          <input
            type="range"
            min={0}
            max={maxSliderValue}
            value={currentSliderValue}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
            disabled={historyData.length <= WINDOW_SIZE}
          />

          <div className="text-xs text-gray-500 w-full flex justify-between mt-1">
            <span>Oldest</span>
            <span>Live View</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacketCountChart;

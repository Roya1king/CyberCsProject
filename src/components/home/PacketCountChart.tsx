

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Slider,
  IconButton,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

interface Packet {
  source_ip: string;
  destination_ip: string;
  packet_length: number;
  protocol: string;
}

const MAX_HISTORY = 300; // keep last 300 seconds (~5 min)
const WINDOW_SIZE = 60;  // show 60 seconds at once

const PacketCountChart: React.FC = () => {
  const [chartData, setChartData] = useState<{ time: string; count: number }[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [windowEnd, setWindowEnd] = useState(MAX_HISTORY); // index of last visible point

  // WebSocket: push updates per packet
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");
    ws.onmessage = (event) => {
      if (!isLive) return;
      try {
        const pkt: Packet = JSON.parse(event.data);
        if (!pkt.packet_length) return;

        const now = new Date();
        const timeKey = now.toLocaleTimeString("en-IN", { hour12: false });

        setChartData((prev) => {
          const newData = [...prev];
          const last = newData[newData.length - 1];

          if (last && last.time === timeKey) {
            last.count += 1;
          } else {
            newData.push({ time: timeKey, count: 1 });
          }
          const trimmed = newData.slice(-MAX_HISTORY);
          setWindowEnd(trimmed.length);
          return trimmed;
        });
      } catch (err) {
        console.error("Invalid packet:", err);
      }
    };

    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onclose = () => console.log("❌ WebSocket disconnected");
    return () => ws.close();
  }, [isLive]);

  // Compute visible window slice
  const start = Math.max(0, windowEnd - WINDOW_SIZE);
  const visibleData = chartData.slice(start, windowEnd);

  const data = {
    labels: visibleData.map((d) => d.time),
    datasets: [
      {
        label: "Packets / second",
        data: visibleData.map((d) => d.count),
        fill: true,
        backgroundColor: "rgba(59,130,246,0.25)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: { duration: 300 },
    plugins: {
      tooltip: { mode: "index", intersect: false },
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280", maxRotation: 0, autoSkip: true },
        grid: { color: "#f3f4f6" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#6b7280" },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  // Handlers for manual scrolling
  const handleSliderChange = (_: Event, value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    setWindowEnd(val);
    // if user scrolls left -> stop live updates
    if (val < chartData.length) setIsLive(false);
  };

  const handleLeft = () => setWindowEnd((prev) => Math.max(prev - 10, WINDOW_SIZE));
  const handleRight = () => setWindowEnd((prev) => Math.min(prev + 10, chartData.length));

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Live Packet Count
            </Typography>
            <Button
              size="small"
              variant="contained"
              color={isLive ? "error" : "primary"}
              onClick={() => setIsLive((v) => !v)}
            >
              {isLive ? "Pause 🔴" : "Resume 🟢"}
            </Button>
          </Box>
        }
      />
      <CardContent>
        <div style={{ height: 320 }}>
          <Line data={data} options={options} />
        </div>

        {/* Navigation Controls */}
        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <IconButton onClick={handleLeft}>
            <ArrowBack />
          </IconButton>

          <Box width="70%" mx={1}>
            <Slider
              min={WINDOW_SIZE}
              max={chartData.length}
              step={1}
              value={windowEnd}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              size="small"
            />
          </Box>

          <IconButton onClick={handleRight}>
            <ArrowForward />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="text.secondary"
          mt={1}
        >
          Scroll to view older data (shows last {WINDOW_SIZE}s of {MAX_HISTORY}s)
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PacketCountChart;

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Link } from "react-router-dom";
// import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { cn } from "@/lib/utils";
// import { useState, useEffect, useRef, useMemo } from "react";
// import { BarChart3 } from "lucide-react";

// interface Packet {
//   source_ip: string;
//   destination_ip: string;
//   packet_length: number;
//   protocol: string;
// }

// interface PacketCountProps {
//   className?: string;
// }

// const PacketCountChart = ({ className }: PacketCountProps) => {
//   const [historyData, setHistoryData] = useState<{ time: string; count: number }[]>([]);
//   const [currentSecondCount, setCurrentSecondCount] = useState(0);
//   const [viewOffset, setViewOffset] = useState(0);
//   const livePacketCounter = useRef(0);

//   const WINDOW_SIZE = 10;

//   // --- WebSocket: Live packet counting ---
//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");
//     ws.onmessage = (event) => {
//       try {
//         const pkt: Packet = JSON.parse(event.data);
//         if (pkt.packet_length) {
//           livePacketCounter.current += 1;
//           setCurrentSecondCount(livePacketCounter.current);
//         }
//       } catch (err) {
//         console.error("Invalid packet:", err);
//       }
//     };
//     ws.onopen = () => console.log("PacketCountChart: WebSocket connected ✅");
//     ws.onclose = () => console.log("PacketCountChart: WebSocket disconnected ❌");
//     return () => ws.close();
//   }, []);

//   // --- Update data every second ---
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const countForSecond = livePacketCounter.current;
//       livePacketCounter.current = 0;
//       setCurrentSecondCount(0);

//       const now = new Date();

//       setHistoryData((prev) => {
//         const newPoint = {
//           time: now.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//           }),
//           count: countForSecond,
//         };
//         const newData = [...prev, newPoint];

//         const maxOffset = Math.max(0, newData.length - WINDOW_SIZE);
//         if (viewOffset + WINDOW_SIZE >= prev.length) {
//           setViewOffset(maxOffset);
//         }

//         return newData;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [viewOffset]);

//   // --- Visible data slice ---
//   const visibleChartData = useMemo(() => {
//     return historyData.slice(viewOffset, viewOffset + WINDOW_SIZE);
//   }, [historyData, viewOffset]);

//   // --- Slider control ---
//   const handleSliderChange = (newOffset: number) => {
//     setViewOffset(newOffset);
//   };

//   const maxSliderValue = Math.max(0, historyData.length - WINDOW_SIZE);
//   const currentSliderValue = viewOffset;

//   return (
//     <Card className={cn("w-full min-h-[420px] p-4", className)}>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//         <CardTitle className="text-base font-semibold flex items-center gap-2">
//           <BarChart3 className="w-5 h-5 text-primary" />
//           <Link to="/dashboard/packet-count" className="hover:underline">
//             Packet Count (per sec)
//           </Link>
//         </CardTitle>
//         <span className="text-3xl font-bold">{currentSecondCount}</span>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         <div className="h-64 w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={visibleChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                 </linearGradient>
//               </defs>

//               <XAxis
//                 dataKey="time"
//                 tick={{ fontSize: 10 }}
//                 interval="preserveStartEnd"
//                 label={{
//                   value: "Time Bucket (HH:MM:SS)",
//                   position: "bottom",
//                   offset: 0,
//                   fill: "#ccc",
//                   fontSize: 10,
//                 }}
//               />

//               <YAxis
//                 tick={{ fontSize: 10 }}
//                 label={{
//                   value: "Packet Count",
//                   angle: -90,
//                   position: "insideLeft",
//                   fill: "#ccc",
//                   fontSize: 10,
//                 }}
//               />

//               <Tooltip
//                 labelFormatter={(label) => `Time Bucket: ${label}`}
//                 formatter={(value) => [`${value} Packets`, "Volume"]}
//               />

//               <Area
//                 type="monotone"
//                 dataKey="count"
//                 stroke="#3b82f6"
//                 fillOpacity={1}
//                 fill="url(#colorCount)"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Slider */}
//         <div className="pt-4 flex flex-col items-center space-y-2">
//           <span className="text-xs text-gray-400">
//             Viewing:{" "}
//             {visibleChartData.length > 0 ? visibleChartData[0].time : "---"} to{" "}
//             {visibleChartData.length > 0
//               ? visibleChartData[visibleChartData.length - 1].time
//               : "---"}
//           </span>

//           <input
//             type="range"
//             min={0}
//             max={maxSliderValue}
//             value={currentSliderValue}
//             onChange={(e) => handleSliderChange(Number(e.target.value))}
//             className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
//             disabled={historyData.length <= WINDOW_SIZE}
//           />

//           <div className="text-xs text-gray-500 w-full flex justify-between mt-1">
//             <span>Oldest</span>
//             <span>Live View</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PacketCountChart;

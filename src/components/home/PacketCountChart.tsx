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

  // Chart data
  const data = {
    labels: visibleData.map((d) => d.time),
    datasets: [
      {
        label: "Packets / second",
        data: visibleData.map((d) => d.count),
        fill: true,
        backgroundColor: "rgba(37,99,235,0.15)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  };

  // Chart options (dark mode)
  const options = {
    responsive: true,
    animation: { duration: 300 },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        backgroundColor: "rgba(31,41,55,0.95)",
      },
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", maxRotation: 0, autoSkip: true },
        grid: { color: "rgba(55,65,81,0.3)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(55,65,81,0.3)" },
      },
    },
  };

  // Handlers for manual scrolling
  const handleSliderChange = (_: Event, value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    setWindowEnd(val);
    if (val < chartData.length) setIsLive(false); // stop live updates if scrolled
  };

  const handleLeft = () => setWindowEnd((prev) => Math.max(prev - 10, WINDOW_SIZE));
  const handleRight = () => setWindowEnd((prev) => Math.min(prev + 10, chartData.length));

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "#111827",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600} color="#f9fafb">
              Live Packet Count
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{
                backgroundColor: isLive ? "#dc2626" : "#2563eb",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: isLive ? "#b91c1c" : "#1d4ed8",
                },
              }}
              onClick={() => setIsLive((v) => !v)}
            >
              {isLive ? "Pause 🔴" : "Resume 🟢"}
            </Button>
          </Box>
        }
      />
      <CardContent>
        <div style={{ height: 320 }}>
          <Line key={windowEnd} data={data} options={options} />
        </div>

        {/* Navigation Controls */}
        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <IconButton
            onClick={handleLeft}
            sx={{ color: "#9ca3af", "&:hover": { color: "#3b82f6" } }}
          >
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
              sx={{
                color: "#3b82f6",
                '& .MuiSlider-thumb': { backgroundColor: "#3b82f6" },
                '& .MuiSlider-rail': { color: "#374151" },
                '& .MuiSlider-track': { color: "#3b82f6" },
              }}
            />
          </Box>

          <IconButton
            onClick={handleRight}
            sx={{ color: "#9ca3af", "&:hover": { color: "#3b82f6" } }}
          >
            <ArrowForward />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="#9ca3af"
          mt={1}
        >
          Scroll to view older data (shows last {WINDOW_SIZE}s of {MAX_HISTORY}s)
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PacketCountChart;

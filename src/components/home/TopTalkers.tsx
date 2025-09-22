import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface TopTalker {
  ip: string;
  packets: number;
}

const TopTalkers = () => {
  const [data, setData] = useState<TopTalker[]>([]);
  const [timeValue, setTimeValue] = useState(1); // Default time value
  const [timeUnit, setTimeUnit] = useState("minutes"); // Default time unit

  useEffect(() => {
    // Convert timeValue and timeUnit to minutes
    const timeInMinutes =
      timeUnit === "minutes"
        ? timeValue
        : timeUnit === "hours"
        ? timeValue * 60
        : timeValue * 1440; // 1 day = 1440 minutes

    // Fetch top talkers data from the API
    const fetchTopTalkers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/top-talkers/${timeInMinutes}`);
        const result = await response.json();

        // Map the API response to the expected format
        const formattedData = result.map((item: { source_ip: string; total_packets: number }) => ({
          ip: item.source_ip,
          packets: item.total_packets,
        }));
        console.log(formattedData)
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch top talkers:", error);
      }
    };

    fetchTopTalkers();
  }, [timeValue, timeUnit]);

  const maxPackets = Math.max(...data.map((d) => d.packets), 1); // Avoid division by zero

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          <Link to="/dashboard/top-talkers" className="hover:underline">Top Talkers</Link>
        </CardTitle>
        <div className="flex items-center gap-2">
          <label htmlFor="time-value" className="text-sm font-medium">Time:</label>
          <input
            id="time-value"
            type="number"
            value={timeValue}
            onChange={(e) => setTimeValue(Math.max(Number(e.target.value), 1))} // Ensure value is at least 1
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-md px-2 py-1 text-gray-900 dark:text-gray-100 w-20"
            min={1}
          />
          <select
            id="time-unit"
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-md px-2 py-1 text-gray-900 dark:text-gray-100"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {data.map((talker, idx) => {
            const widthPercent = (talker.packets / maxPackets) * 100;
            return (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium w-24">{talker.ip}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-red-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="text-sm w-12 text-right">{talker.packets}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTalkers;

import { useEffect, useState, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Interface for the health check API response and state
interface HealthData {
  ip_address: string;
  is_alive: boolean;
  rtt_avg_ms: string;
  packets_sent: number;
  packets_received: number;
  packet_loss_percent: string;
  error?: string; // Optional property for fetch errors
}

// Interface for each row in our network data state
interface NetworkDataRow {
  ip: string;
  health: Partial<HealthData> | null; // Use Partial to allow for the error-only state
  isLoading: boolean;
}

// Interface for the top-talkers API response item
interface ApiTopTalker {
  source_ip: string;
  total_packets: number;
}

// Type for the time unit state
type TimeUnit = "minutes" | "hours" | "days";

// Main Network Health Component
const NetworkHealth = (): JSX.Element => {
  // State for time selection
  const [timeValue, setTimeValue] = useState<number>(1);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("minutes");

  // State to hold the combined top talker and health data
  const [networkData, setNetworkData] = useState<NetworkDataRow[]>([]);
  const [isTopTalkersLoading, setIsTopTalkersLoading] = useState<boolean>(false);

  // Effect to fetch top talkers when the time range changes
  useEffect(() => {
    const fetchTopTalkers = async () => {
      // Convert selected time to minutes
      const timeInMinutes =
        timeUnit === "minutes"
          ? timeValue
          : timeUnit === "hours"
          ? timeValue * 60
          : timeValue * 1440; // 1 day = 1440 minutes

      setIsTopTalkersLoading(true);
      try {
        // Fetch top talkers data from the API
        const response = await fetch(`http://localhost:8000/api/top-talkers/${timeInMinutes}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiTopTalker[] = await response.json();

        // Format the data for our table, initializing health and loading states
        const formattedData: NetworkDataRow[] = result.map((item) => ({
          ip: item.source_ip,
          health: null, // Health data will be fetched on demand
          isLoading: false, // For individual row loading state
        }));
        setNetworkData(formattedData);
      } catch (error) {
        console.error("Failed to fetch top talkers:", error);
        setNetworkData([]); // Clear data on error
      } finally {
        setIsTopTalkersLoading(false);
      }
    };

    fetchTopTalkers();
  }, [timeValue, timeUnit]);

  // Function to fetch health check for a single IP
  const handleHealthCheck = async (ipAddress: string, index: number): Promise<void> => {
    // Set loading state for the specific row
    setNetworkData((currentData) =>
      currentData.map((item, i) =>
        i === index ? { ...item, isLoading: true } : item
      )
    );

    try {
      const response = await fetch(`http://localhost:8000/api/health/check-ip/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip_address : ipAddress }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const healthResult: HealthData = await response.json();

      // Update the state with the fetched health data for the specific row
      setNetworkData((currentData) =>
        currentData.map((item, i) =>
          i === index ? { ...item, health: healthResult, isLoading: false } : item
        )
      );
    } catch (error) {
      console.error(`Failed to fetch health for ${ipAddress}:`, error);
      // Reset loading state on error
      setNetworkData((currentData) =>
        currentData.map((item, i) =>
          i === index ? { ...item, health: { error: 'Failed to fetch' }, isLoading: false } : item
        )
      );
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Network Health</CardTitle>
          <div className="flex items-center gap-2">
            <label htmlFor="time-value" className="text-sm font-medium">Time:</label>
            <input
              id="time-value"
              type="number"
              value={timeValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeValue(Math.max(Number(e.target.value), 1))}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-md px-2 py-1 w-20"
              min={1}
            />
            <select
              id="time-unit"
              value={timeUnit}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setTimeUnit(e.target.value as TimeUnit)}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-md px-2 py-1"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">IP Address</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Avg RTT (ms)</th>
                  <th scope="col" className="px-6 py-3">Packets Sent</th>
                  <th scope="col" className="px-6 py-3">Packets Received</th>
                  <th scope="col" className="px-6 py-3">Packet Loss (%)</th>
                  <th scope="col" className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {isTopTalkersLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8">Loading top talkers...</td>
                  </tr>
                ) : networkData.length > 0 ? (
                  networkData.map((item, index) => (
                    <tr key={item.ip} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-mono">{item.ip}</td>
                      <td className="px-6 py-4">
                        {item.health && !item.health.error ? (
                          <span className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${item.health.is_alive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {item.health.is_alive ? 'Up' : 'Down'}
                          </span>
                        ) : (
                          <span className="text-gray-400">{item.health?.error || '–'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{item.health?.rtt_avg_ms ?? '–'}</td>
                      <td className="px-6 py-4">{item.health?.packets_sent ?? '–'}</td>
                      <td className="px-6 py-4">{item.health?.packets_received ?? '–'}</td>
                      <td className="px-6 py-4">{item.health?.packet_loss_percent ?? '–'}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleHealthCheck(item.ip, index)}
                          disabled={item.isLoading}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline disabled:opacity-50 disabled:cursor-wait"
                        >
                          {item.isLoading ? 'Checking...' : 'Refresh'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr>
                    <td colSpan={7} className="text-center p-8">No data available for the selected time range.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkHealth;




// import Breadcrumbs from "./Breadcrumbs";
// import { NavLink, Outlet } from "react-router-dom";
// import ThemeToggle from "./ThemeToggle";
// import {
//   Activity,
//   ShieldAlert,
//   Network,
//   Cpu,
//   LineChart,
//   HeartPulse,
//   Table as TableIcon,
//   Settings,
//   LayoutDashboard,
// } from "lucide-react";

// const DashboardLayout = () => {
//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-background text-left overflow-hidden">
//       {/* --- SIDEBAR --- */}
//       <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-card text-card-foreground shadow-sm p-4 fixed top-0 left-0 h-screen">
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <ThemeToggle />
//           </div>

//           <div className="text-base font-semibold flex items-center gap-2 mb-4">
//             <Activity size={18} /> C Y B E R
//           </div>

//           {/* Overview */}
//           <div className="text-xs uppercase text-muted-foreground mb-2">Overview</div>
//           <nav className="flex flex-col gap-1 text-sm">
//             <NavLink
//               to="/dashboard"
//               end
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <LayoutDashboard size={16} /> Dashboard
//             </NavLink>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <LayoutDashboard size={16} /> Home
//             </NavLink>
//           </nav>

//           {/* Analytics */}
//           <div className="text-xs uppercase text-muted-foreground mt-5 mb-2">Analytics</div>
//           <nav className="flex flex-col gap-1 text-sm overflow-y-auto pr-2">
//             <NavLink
//               to="/dashboard/live-packets"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <TableIcon size={16} /> Live Packets
//             </NavLink>
//             <NavLink
//               to="/dashboard/network-visualization"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <HeartPulse size={16} /> Network Visualization
//             </NavLink>
//             <NavLink
//               to="/dashboard/network-health"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <HeartPulse size={16} /> Network Health
//             </NavLink>
//             <NavLink
//               to="/dashboard/threats"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <ShieldAlert size={16} /> Threats
//             </NavLink>
//             <NavLink
//               to="/dashboard/policy-violations"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <Network size={16} /> Policy Violations
//             </NavLink>
//             <NavLink
//               to="/dashboard/top-talkers"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <LineChart size={16} /> Top Talkers
//             </NavLink>
//             <NavLink
//               to="/dashboard/bandwidth"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <Cpu size={16} /> Bandwidth
//             </NavLink>
//             <NavLink
//               to="/dashboard/network"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <Network size={16} /> Network Status
//             </NavLink>
//             <NavLink
//               to="/dashboard/packet-count"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <LineChart size={16} /> Packet Count
//             </NavLink>
//           </nav>

//           {/* Footer */}
//           <div className="mt-auto pt-6">
//             <div className="text-xs uppercase text-muted-foreground mb-2">Settings</div>
//             <NavLink
//               to="#"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
//                   isActive ? "bg-muted text-foreground" : "text-muted-foreground"
//                 }`
//               }
//             >
//               <Settings size={16} /> Preferences
//             </NavLink>
//           </div>
//         </div>
//       </aside>

//       {/* --- MAIN CONTENT --- */}
//       <main className="flex-1 md:ml-64 p-4 overflow-y-auto min-h-screen">
//         <div className="flex items-center justify-between mb-6">
//           <Breadcrumbs />
//           <div className="md:hidden">
//             <ThemeToggle />
//           </div>
//         </div>

//         <div className="pb-10">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;
import { useEffect, useRef } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import {
  Activity,
  ShieldAlert,
  Network,
  Cpu,
  LineChart,
  HeartPulse,
  Table as TableIcon,
  Settings,
  LayoutDashboard,
} from "lucide-react";

// --- START: Added Imports and Types for Alert Polling ---

// IMPORTANT: Assume this function is imported from your toast library (e.g., sonner, react-hot-toast)
// You MUST ensure 'toast' is imported here if you remove the console.log mock.
// Example: import { toast } from 'sonner';

// Mock toast function for demonstration (replace with actual import)
const toast = (title: string, options: any) => {
    console.log(`[GLOBAL TOAST] ${title} - Severity Class: ${options.toastClass}`);
}; 

interface AlertItem {
  id: number;
  timestamp: string;
  signature: string;
  severity: number;
  protocol: string;
  src_ip: string;
  src_port?: number | null;
  dest_ip: string;
  dest_port?: number | null;
}

// Function to return the color/class based on severity
const severityColor = (sev: number) => {
  switch (sev) {
    case 1:
      return "bg-green-600/20 text-green-400"; // Low
    case 2:
      return "bg-yellow-600/20 text-yellow-400"; // Medium
    case 3:
      return "bg-red-600/20 text-red-400"; // High
    default:
      return "bg-gray-600/20 text-gray-300";
  }
};

// Helper function to show a custom toast notification with color
const notifyNewAlert = (alert: AlertItem) => {
  const severityText = alert.severity === 3 ? "High" : alert.severity === 2 ? "Medium" : "Low";
  const colorClass = severityColor(alert.severity); // Get the matching color class

  toast(`${severityText} Policy Violation Detected! 🚨`, {
    description: `${alert.signature} | ${alert.src_ip} -> ${alert.dest_ip} (${alert.protocol})`,
    duration: 5000,
    toastClass: colorClass, // Pass the color class for custom styling
  });
};

// --- END: Added Imports and Types for Alert Polling ---

const DashboardLayout = () => {
  // Ref to track the timestamp of the last alert we successfully notified about
  const lastAlertTimestamp = useRef<string | null>(null);

  // --- GLOBAL ALERT POLLING LOGIC ---
  useEffect(() => {
    const fetchAlertsAndNotify = async () => {
      try {
        // NOTE: This endpoint URL must match the one in PolicyViolations.tsx
        const response = await fetch("http://localhost:8000/api/security-alerts/");
        if (!response.ok) throw new Error("Failed to fetch alerts");
        const jsonData = await response.json();
        const newAlerts: AlertItem[] = jsonData.alerts || [];

        if (newAlerts.length > 0) {
          // Find the absolute latest alert
          const mostRecentAlert = newAlerts.reduce((latest, current) => 
              new Date(current.timestamp).getTime() > new Date(latest.timestamp).getTime() ? current : latest
          , newAlerts[0]); 

          // Initial load check
          if (lastAlertTimestamp.current === null) {
            lastAlertTimestamp.current = mostRecentAlert.timestamp;
          } else {
            const lastSeenTime = new Date(lastAlertTimestamp.current).getTime();
            const newAlertTime = new Date(mostRecentAlert.timestamp).getTime();

            if (newAlertTime > lastSeenTime) {
              // Filter and notify for all new alerts since the last check
              const incomingAlerts = newAlerts.filter(alert => 
                  new Date(alert.timestamp).getTime() > lastSeenTime
              );

              // Notify in ascending time order
              incomingAlerts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .forEach(alert => notifyNewAlert(alert));

              // Update the last seen timestamp
              lastAlertTimestamp.current = mostRecentAlert.timestamp;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching global alerts:", error);
      }
    };

    // Start polling every 3 seconds
    fetchAlertsAndNotify();
    const interval = setInterval(fetchAlertsAndNotify, 3000); 

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once on mount

  // --- END GLOBAL ALERT POLLING LOGIC ---

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-left overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-card text-card-foreground shadow-sm p-4 fixed top-0 left-0 h-screen">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <ThemeToggle />
          </div>

          <div className="text-base font-semibold flex items-center gap-2 mb-4">
            <Activity size={18} /> C Y B E R
          </div>

          {/* Overview */}
          <div className="text-xs uppercase text-muted-foreground mb-2">Overview</div>
          <nav className="flex flex-col gap-1 text-sm">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <LayoutDashboard size={16} /> Home
            </NavLink>
          </nav>

          {/* Analytics */}
          <div className="text-xs uppercase text-muted-foreground mt-5 mb-2">Analytics</div>
          <nav className="flex flex-col gap-1 text-sm overflow-y-auto pr-2">
            <NavLink
              to="/dashboard/live-packets"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <TableIcon size={16} /> Live Packets
            </NavLink>
            <NavLink
              to="/dashboard/network-visualization"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <HeartPulse size={16} /> Network Visualization
            </NavLink>
            <NavLink
              to="/dashboard/network-health"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <HeartPulse size={16} /> Network Health
            </NavLink>
            <NavLink
              to="/dashboard/threats"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <ShieldAlert size={16} /> Threats
            </NavLink>
            <NavLink
              to="/dashboard/policy-violations"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Network size={16} /> Policy Violations
            </NavLink>
            <NavLink
              to="/dashboard/top-talkers"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <LineChart size={16} /> Top Talkers
            </NavLink>
            <NavLink
              to="/dashboard/bandwidth"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Cpu size={16} /> Bandwidth
            </NavLink>
            <NavLink
              to="/dashboard/network"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Network size={16} /> Network Status
            </NavLink>
            <NavLink
              to="/dashboard/packet-count"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <LineChart size={16} /> Packet Count
            </NavLink>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6">
            <div className="text-xs uppercase text-muted-foreground mb-2">Settings</div>
            <NavLink
              to="#"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Settings size={16} /> Preferences
            </NavLink>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-4 overflow-y-auto min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <Breadcrumbs />
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="pb-10">
          {/* Outlet Renders the specific dashboard page content (e.g., PacketCountPage) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
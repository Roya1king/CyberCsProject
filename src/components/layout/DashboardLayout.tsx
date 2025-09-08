import Breadcrumbs from "./Breadcrumbs";
import { NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Activity, ShieldAlert, Network, Cpu, LineChart, Table as TableIcon, Settings, LayoutDashboard } from "lucide-react";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-screen text-left">
      <aside className="hidden md:flex md:w-64 shrink-0 rounded-xl border bg-card text-card-foreground shadow p-4 md:h-[calc(100vh-2rem)] md:sticky md:top-4">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold flex items-center gap-2"><Activity size={18}/> Security Console</div>
            <ThemeToggle/>
          </div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Overview</div>
          <nav className="flex flex-col gap-1 text-sm">
            <NavLink to="/dashboard" end className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><LayoutDashboard size={16}/> Dashboard</NavLink>
            <NavLink to="/" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><LayoutDashboard size={16}/> Home</NavLink>
          </nav>
          <div className="text-xs uppercase text-muted-foreground mt-4 mb-2">Analytics</div>
          <nav className="flex flex-col gap-1 text-sm">
            <NavLink to="/dashboard/live-packets" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><TableIcon size={16}/> Live Packets</NavLink>
            <NavLink to="/dashboard/threats" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><ShieldAlert size={16}/> Threats</NavLink>
            <NavLink to="/dashboard/policy-violations" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><Network size={16}/> Policy Violations</NavLink>
            <NavLink to="/dashboard/top-talkers" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><LineChart size={16}/> Top Talkers</NavLink>
            <NavLink to="/dashboard/bandwidth" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><Cpu size={16}/> Bandwidth</NavLink>
            <NavLink to="/dashboard/network" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><Network size={16}/> Network Status</NavLink>
            <NavLink to="/dashboard/packet-count" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><LineChart size={16}/> Packet Count</NavLink>
          </nav>
          <div className="mt-auto pt-4">
            <div className="text-xs uppercase text-muted-foreground mb-2">Settings</div>
            <NavLink to="#" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted ${isActive? 'bg-muted text-foreground' : 'text-muted-foreground'}`}><Settings size={16}/> Preferences</NavLink>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <Breadcrumbs/>
          <div className="md:hidden"><ThemeToggle/></div>
        </div>
        <div><Outlet/></div>
      </main>
    </div>
  );
};

export default DashboardLayout;



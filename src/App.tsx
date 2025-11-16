import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'

// --- Import All Page Components ---
import Hero from './components/home/Hero'
import Welcome from './components/home/Welcome'
import DashboardLayout from './components/layout/DashboardLayout'
import LivePacketsPage from './components/detailsPage/LivePacketsPage'
import BandwidthPage from './components/detailsPage/BandwidthPage'
import NetworkStatusPage from './components/detailsPage/NetworkStatusPage'
import PacketCountPage from './components/detailsPage/PacketCountPage'
import PolicyViolationsPage from './components/detailsPage/PolicyViolationsPage'
import TopTalkersPage from './components/detailsPage/TopTalkersPage'
import ThreatsPage from './components/detailsPage/ThreatsPage'
import NetworkHealth from './components/detailsPage/NetworkHealth'
import Visualization from "./components/detailsPage/Visualization"

// --- IMPORTANT: Toast Provider Import ---
// This is required for PolicyViolations.tsx to show real-time alerts.
// Replace 'sonner' with your chosen library if different.
import { Toaster } from 'sonner'; 
// If you don't have 'sonner', you will need to install it: npm install sonner

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Public/Landing Route */}
        <Route path="/" element={<Welcome/>} />
        
        {/* Dashboard Routes (Wrapped in Layout) */}
        <Route path="/dashboard" element={<DashboardLayout/>}>
          <Route index element={<Hero/>} />
          <Route path="live-packets" element={<LivePacketsPage/>} />
          <Route path="bandwidth" element={<BandwidthPage total={100} />} />
          <Route path="network" element={<NetworkStatusPage/>} />
          <Route path="packet-count" element={<PacketCountPage/>} />
          <Route path="policy-violations" element={<PolicyViolationsPage/>} />
          <Route path="top-talkers" element={<TopTalkersPage/>} />
          <Route path="threats" element={<ThreatsPage/>} />
          <Route path="network-health" element={<NetworkHealth/>} />
          <Route path="network-visualization" element={<Visualization/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    
    {/* --- GLOBAL TOAST PROVIDER --- */}
    {/* This makes the toast function available throughout the application. */}
    <Toaster position="bottom-right" />
    </>
  )
}

export default App
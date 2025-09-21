import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route, Navigate } from 'react-router-dom'
import Hero from './components/home/Hero'
import LivePacketsPage from './components/detailsPage/LivePacketsPage'
import DashboardLayout from './components/layout/DashboardLayout'
import BandwidthPage from './components/detailsPage/BandwidthPage'
import NetworkStatusPage from './components/detailsPage/NetworkStatusPage'
import PacketCountPage from './components/detailsPage/PacketCountPage'
import PolicyViolationsPage from './components/detailsPage/PolicyViolationsPage'
import TopTalkersPage from './components/detailsPage/TopTalkersPage'
import ThreatsPage from './components/detailsPage/ThreatsPage'
import Welcome from './components/home/Welcome'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome/>} />
      <Route path="/dashboard" element={<DashboardLayout/>}>
        <Route index element={<Hero/>} />
        <Route path="live-packets" element={<LivePacketsPage/>} />
        <Route path="bandwidth" element={<BandwidthPage/>} />
        <Route path="network" element={<NetworkStatusPage/>} />
        <Route path="packet-count" element={<PacketCountPage/>} />
        <Route path="policy-violations" element={<PolicyViolationsPage/>} />
        <Route path="top-talkers" element={<TopTalkersPage/>} />
        <Route path="threats" element={<ThreatsPage/>} />
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

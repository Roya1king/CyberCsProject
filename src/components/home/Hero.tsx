import BandwidthCard from './BandWidthCard'
import LivePackets from './LivePackets'
import NetworkGauge from './NetworkGauge'
import PolicyViolations from './PolicyVoilations'
import ThreatsDetected from './Threatsdetected'
import TopTalkers from './TopTalkers'
import PacketCountChart from './PacketCountChart'

const Hero = () => {
  // When a specific view is selected, render it on the right side and keep
  // the left and middle sections intact.
  return (
      <div className="grid grid-cols-12 gap-3">
        {/* Row 1: Left Live Packets (1/2), Right Bandwidth + Network (1/2) */}
        <div className="col-span-12 md:col-span-6 order-1 md:order-none">
          <div className="h-56 overflow-y-auto"><LivePackets/></div>
        </div>
        <div className="col-span-12 md:col-span-6 order-2 md:order-none grid gap-3 grid-cols-1 md:grid-cols-2">
          <BandwidthCard used={120} total={500} unit="Mbps" className="h-56 overflow-hidden"/>
          <NetworkGauge value={57} className="h-56 overflow-visible"/>
        </div>

        {/* Row 2: Left Packet Count (1/2), Right Threats (1/2) */}
        <div className="col-span-12 md:col-span-6 order-3">
          <PacketCountChart className="h-64"/>
        </div>
        <div className="col-span-12 md:col-span-6 order-4">
          <div className="h-64 overflow-y-auto"><ThreatsDetected/></div>
        </div>

        {/* Row 3: Full width split: Left Top Talkers, Right Policy Violations */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-3 order-5">
          <div className="h-56 overflow-y-auto"><TopTalkers/></div>
          <div className="h-56 overflow-y-auto"><PolicyViolations/></div>
        </div>
      </div>
  )
}

export default Hero
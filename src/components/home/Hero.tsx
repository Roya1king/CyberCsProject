import BandwidthCard from './BandWidthCard'
import LivePackets from './LivePackets'
import NetworkGauge from './NetworkGauge'
import PolicyViolations from './PolicyVoilations'
import ThreatsDetected from './Threatsdetected'
import TopTalkers from './TopTalkers'

const Hero = () => {
  return (
    <div>
        <NetworkGauge value={57}/>
        <BandwidthCard used={120} total={500} unit="Mbps"/>
        <LivePackets/>
        <TopTalkers/>
        <PolicyViolations/>
        <ThreatsDetected/>
    </div>
  )
}

export default Hero
import BandwidthCard from "../home/BandWidthCard";

const BandwidthPage = () => {
  return (
    <div className="grid gap-4">
      <BandwidthCard used={320} total={1000} unit="Mbps" className="h-56"/>
    </div>
  );
};

export default BandwidthPage;



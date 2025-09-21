import NetworkGauge from "../home/NetworkGauge";

const NetworkStatusPage = () => {
  return (
    <div className="grid gap-4">
      <NetworkGauge value={72} className="h-56"/>
    </div>
  );
};

export default NetworkStatusPage;




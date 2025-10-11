import NetworkGauge from "../home/NetworkGauge";

const NetworkStatusPage = () => {
  return (
    <div className="grid grid-cols-3 gap-4 h-52">
      <NetworkGauge value={100} className="h-56"/>
    </div>
  );
};

export default NetworkStatusPage;





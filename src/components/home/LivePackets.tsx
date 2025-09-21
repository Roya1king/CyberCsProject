import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LivePackets = () => {
  // Static dummy data
  const packets = [
    { time: "12:01:02", src: "192.168.0.1", dest: "192.168.0.5", protocol: "TCP", length: 1500, info: "ACK" },
    { time: "12:01:03", src: "192.168.0.5", dest: "192.168.0.1", protocol: "TCP", length: 1500, info: "SYN" },
    { time: "12:01:05", src: "192.168.0.2", dest: "8.8.8.8", protocol: "ICMP", length: 64, info: "Ping Request" },
    { time: "12:01:06", src: "8.8.8.8", dest: "192.168.0.2", protocol: "ICMP", length: 64, info: "Ping Reply" },
    { time: "12:01:08", src: "192.168.0.3", dest: "192.168.0.4", protocol: "UDP", length: 512, info: "Data" },
  ];

  return (
     <Link to="/dashboard/live-packets" className="block">
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live Packets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packets.map((pkt, idx) => (
                <TableRow key={idx} className="text-sm">
                  <TableCell>{pkt.time}</TableCell>
                  <TableCell>{pkt.src}</TableCell>
                  <TableCell>{pkt.dest}</TableCell>
                  <TableCell>{pkt.protocol}</TableCell>
                  <TableCell>{pkt.length}</TableCell>
                  <TableCell>{pkt.info}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default LivePackets;

import { useEffect, useState } from "react";
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

interface Packet {
  time: string;
  src: string;
  dest: string;
  protocol: string;
  length: number;
  info: string;
}

const LivePackets = () => {
  const [packets, setPackets] = useState<Packet[]>([]);

  useEffect(() => {
    // Connect WebSocket (replace with your server URL)
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      try {
        const pkt = JSON.parse(event.data);

        // Map the incoming data to the Packet structure
        const newPkt: Packet = {
          time: new Date().toLocaleTimeString(),
          src: pkt.source_ip,
          dest: pkt.destination_ip,
          protocol: pkt.protocol,
          length: pkt.packet_length,
          info: "N/A", // Placeholder for additional info
        };

        // Keep only the last 20 packets
        setPackets((prev) => [...prev.slice(-19), newPkt]);
      } catch (err) {
        console.error("Invalid packet:", err);
      }
    };

    ws.onopen = () => console.log("WebSocket connected ✅");
    ws.onclose = () => console.log("WebSocket disconnected ❌");

    return () => ws.close();
  }, []);

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

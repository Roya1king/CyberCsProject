import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Packet {
  time: string;
  src: string;
  dest: string;
  protocol: string;
  length: number;
  info: string;
  flags?: string;
  ttl?: number;
  [key: string]: string | number | undefined;
}

const packets: Packet[] = [
  {
    time: "12:01:02",
    src: "192.168.0.1",
    dest: "192.168.0.5",
    protocol: "TCP",
    length: 1500,
    info: "ACK",
    flags: "SYN, ACK",
    ttl: 64,
  },
  {
    time: "12:01:03",
    src: "192.168.0.5",
    dest: "192.168.0.1",
    protocol: "TCP",
    length: 1500,
    info: "SYN",
    flags: "SYN",
    ttl: 64,
  },
  {
    time: "12:01:05",
    src: "192.168.0.2",
    dest: "8.8.8.8",
    protocol: "ICMP",
    length: 64,
    info: "Ping Request",
    ttl: 128,
  },
  {
    time: "12:01:06",
    src: "8.8.8.8",
    dest: "192.168.0.2",
    protocol: "ICMP",
    length: 64,
    info: "Ping Reply",
    ttl: 128,
  },
];

const LivePacketsPage = () => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (idx: number) => {
    setExpandedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Live Packet Capture</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
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
                  <div key={idx}>
                    <TableRow
                      className="text-sm cursor-pointer"
                      onClick={() => toggleRow(idx)}
                    >
                      <TableCell>
                        {expandedRows.includes(idx) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </TableCell>
                      <TableCell>{pkt.time}</TableCell>
                      <TableCell>{pkt.src}</TableCell>
                      <TableCell>{pkt.dest}</TableCell>
                      <TableCell>{pkt.protocol}</TableCell>
                      <TableCell>{pkt.length}</TableCell>
                      <TableCell>{pkt.info}</TableCell>
                    </TableRow>
                    {expandedRows.includes(idx) && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={7}>
                          <div className="p-2 text-sm font-mono">
                            {Object.entries(pkt)
                              .filter(([key]) => !["time","src","dest","protocol","length","info"].includes(key))
                              .map(([key, val]) => (
                                <div key={key}>
                                  <span className="font-semibold">{key}: </span>
                                  <span>{val}</span>
                                </div>
                              ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </div>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePacketsPage;

import { useEffect, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Packet {
  time: string;
  src: string;
  dest: string;
  protocol: string;
  length: number;

}

// IPv4 validation helper
const isValidIP = (ip: string): boolean => {
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return ipv4Pattern.test(ip);
};

const LivePackets = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [protocolFilter, setProtocolFilter] = useState<string>("All Protocols");
  const [srcFilter, setSrcFilter] = useState<string>("");
  const [destFilter, setDestFilter] = useState<string>("");
  const [srcError, setSrcError] = useState<string>("");
  const [destError, setDestError] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");

    ws.onmessage = (event) => {
      try {
        const pkt = JSON.parse(event.data);
        const newPkt: Packet = {
          time: new Date().toLocaleTimeString(),
          src: pkt.source_ip,
          dest: pkt.destination_ip,
          protocol: pkt.protocol,
          length: pkt.packet_length
        };
        setPackets((prev) => [...prev.slice(-99), newPkt]);
      } catch (err) {
        console.error("Invalid packet:", err);
      }
    };

    ws.onopen = () => console.log("WebSocket connected ✅");
    ws.onclose = () => console.log("WebSocket disconnected ❌");

    return () => ws.close();
  }, []);

  // Real-time validation
  const handleSrcChange = (value: string) => {
    setSrcFilter(value);
    setSrcError(value && !isValidIP(value) ? "Invalid IP" : "");
  };
  const handleDestChange = (value: string) => {
    setDestFilter(value);
    setDestError(value && !isValidIP(value) ? "Invalid IP" : "");
  };

  // Filter packets
  const filteredPackets = useMemo(() => {
    if (srcError || destError) return [];

    return packets.filter((pkt) => {
      const protoMatch =
        protocolFilter === "All Protocols" ||
        pkt.protocol.toLowerCase() === protocolFilter.toLowerCase();
      const srcMatch = srcFilter === "" || pkt.src.includes(srcFilter);
      const destMatch = destFilter === "" || pkt.dest.includes(destFilter);
      return protoMatch && srcMatch && destMatch;
    });
  }, [packets, protocolFilter, srcFilter, destFilter, srcError, destError]);

  const protocolOptions = useMemo(() => {
    const unique = Array.from(new Set(packets.map((p) => p.protocol))).sort();
    return ["All Protocols", ...unique];
  }, [packets]);

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

                  {/* Source IP Filter */}
                  <TableHead className="w-[180px]">
                    <Input
                      placeholder="Source IP"
                      value={srcFilter}
                      onChange={(e) => handleSrcChange(e.target.value)}
                      className={`h-8 text-xs ${
                        srcError ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                    />
                    {srcError && (
                      <span className="text-[10px] text-red-500">{srcError}</span>
                    )}
                  </TableHead>

                  {/* Destination IP Filter */}
                  <TableHead className="w-[180px]">
                    <Input
                      placeholder="Destination IP"
                      value={destFilter}
                      onChange={(e) => handleDestChange(e.target.value)}
                      className={`h-8 text-xs ${
                        destError ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                    />
                    {destError && (
                      <span className="text-[10px] text-red-500">{destError}</span>
                    )}
                  </TableHead>

                  {/* Protocol Dropdown */}
                  <TableHead className="w-[140px]">
                    <Select
                      value={protocolFilter}
                      onValueChange={setProtocolFilter}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        {protocolOptions.map((proto) => (
                          <SelectItem key={proto} value={proto}>
                            {proto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableHead>

                  <TableHead>Length</TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPackets.length > 0 ? (
                  filteredPackets.map((pkt, idx) => (
                    <TableRow key={idx} className="text-sm">
                      <TableCell>{pkt.time}</TableCell>
                      <TableCell>{pkt.src}</TableCell>
                      <TableCell>{pkt.dest}</TableCell>
                      <TableCell>{pkt.protocol}</TableCell>
                      <TableCell>{pkt.length}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                      {srcError || destError
                        ? "Invalid IP entered — please correct it."
                        : "No packets match the selected filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LivePackets;



// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface Packet {
//   time: string;
//   src: string;
//   dest: string;
//   protocol: string;
//   length: number;
//   info: string;
// }

// const LivePackets = () => {
//   const [packets, setPackets] = useState<Packet[]>([]);

//   useEffect(() => {
//     // Connect WebSocket (replace with your server URL)
//     const ws = new WebSocket("ws://localhost:8000/ws/live-packets/");

//     ws.onmessage = (event) => {
//       try {
//         const pkt = JSON.parse(event.data);

//         // Map the incoming data to the Packet structure
//         const newPkt: Packet = {
//           time: new Date().toLocaleTimeString(),
//           src: pkt.source_ip,
//           dest: pkt.destination_ip,
//           protocol: pkt.protocol,
//           length: pkt.packet_length,
//           info: "N/A", // Placeholder for additional info
//         };

//         // Keep only the last 20 packets
//         setPackets((prev) => [...prev.slice(-99), newPkt]);
//       } catch (err) {
//         console.error("Invalid packet:", err);
//       }
//     };

//     ws.onopen = () => console.log("WebSocket connected ✅");
//     ws.onclose = () => console.log("WebSocket disconnected ❌");

//     return () => ws.close();
//   }, []);

//   return (
//     <Link to="/dashboard/live-packets" className="block">
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle>Live Packets</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Source</TableHead>
//                   <TableHead>Destination</TableHead>
//                   <TableHead>Protocol</TableHead>
//                   <TableHead>Length</TableHead>
//                   <TableHead>Info</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {packets.map((pkt, idx) => (
//                   <TableRow key={idx} className="text-sm">
//                     <TableCell>{pkt.time}</TableCell>
//                     <TableCell>{pkt.src}</TableCell>
//                     <TableCell>{pkt.dest}</TableCell>
//                     <TableCell>{pkt.protocol}</TableCell>
//                     <TableCell>{pkt.length}</TableCell>
//                     <TableCell>{pkt.info}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// };

// export default LivePackets;

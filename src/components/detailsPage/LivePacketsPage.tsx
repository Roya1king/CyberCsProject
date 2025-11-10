import { useEffect, useState, useMemo } from "react";
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

// --- UPDATED INTERFACE ---
interface Packet {
  time: string;
  src: string;
  srcPort: number | null; // Added
  dest: string;
  destPort: number | null; // Added
  protocol: string | null; // Can be null
  length: number;
}
// --- END UPDATE ---

// IPv4 validation helper
const isValidIP = (ip: string): boolean => {
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return ipv4Pattern.test(ip);
};

const LivePacketsPage = () => {
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
        
        // --- UPDATED PACKET CREATION ---
        const newPkt: Packet = {
          time: new Date().toLocaleTimeString(),
          src: pkt.source_ip,
          srcPort: pkt.source_port, // Added
          dest: pkt.destination_ip,
          destPort: pkt.destination_port, // Added
          protocol: pkt.protocol,
          length: pkt.packet_length,
        };
        // --- END UPDATE ---

        setPackets((prev) => [...prev.slice(-99), newPkt]);
      } catch (err) {
        console.error("Invalid packet:", err);
      }
    };

    ws.onopen = () => console.log("WebSocket connected ✅");
    ws.onclose = () => console.log("WebSocket disconnected ❌");

    return () => ws.close();
  }, []);

  const handleSrcChange = (value: string) => {
    setSrcFilter(value);
    setSrcError(value && !isValidIP(value) ? "Invalid IP" : "");
  };

  const handleDestChange = (value: string) => {
    setDestFilter(value);
    setDestError(value && !isValidIP(value) ? "Invalid IP" : "");
  };

  const filteredPackets = useMemo(() => {
    if (srcError || destError) return [];

    return packets.filter((pkt) => {
      // --- UPDATED PROTOCOL MATCH TO BE NULL-SAFE ---
      const protoMatch =
        protocolFilter === "All Protocols" ||
        (pkt.protocol &&
          pkt.protocol.toLowerCase() === protocolFilter.toLowerCase());
      
      // This logic remains the same, as it filters on the IP (pkt.src)
      const srcMatch = srcFilter === "" || pkt.src.includes(srcFilter);
      const destMatch = destFilter === "" || pkt.dest.includes(destFilter);
      return protoMatch && srcMatch && destMatch;
    });
  }, [packets, protocolFilter, srcFilter, destFilter, srcError, destError]);

  const protocolOptions = useMemo(() => {
    // --- UPDATED TO FILTER OUT NULL/UNDEFINED PROTOCOLS ---
    const unique = Array.from(
      new Set(packets.map((p) => p.protocol).filter(Boolean))
    ).sort() as string[];
    return ["All Protocols", ...unique];
  }, [packets]);

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-7xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Live Packets
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
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
                  <TableHead>Source Port</TableHead>
                  <TableHead className="w-[180px]">
                    <Input
                      placeholder="Destination IP"
                      value={destFilter}
                      onChange={(e) => handleDestChange(e.target.value)}
                      className={`h-8 text-xs ${
                        destError
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    {destError && (
                      <span className="text-[10px] text-red-500">{destError}</span>
                    )}
                  </TableHead>
                  <TableHead>Destination Port</TableHead>
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
                      
                      {/* --- UPDATED CELL DISPLAY --- */}
                      <TableCell>{pkt.src}</TableCell>
                      <TableCell>{pkt.srcPort ?? "N/A"}</TableCell>
                      <TableCell>{pkt.dest}</TableCell>
                      <TableCell>{pkt.destPort ?? "N/A"}</TableCell>
                      {/* --- END UPDATE --- */}
                      
                      <TableCell>{pkt.protocol || "N/A"}</TableCell>
                      <TableCell>{pkt.length}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      // --- FIXED COLSPAN (WAS 6, SHOULD BE 5) ---
                      colSpan={7}
                      className="text-center text-gray-500 py-4"
                    >
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
    </div>
  );
};

export default LivePacketsPage;
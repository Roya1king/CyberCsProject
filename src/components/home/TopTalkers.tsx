import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { ArrowUp } from "lucide-react";

interface TopTalkersProps {
  data?: { ip: string; packets: number }[];
}

const TopTalkers = ({
  data = [
    { ip: "192.168.0.1", packets: 1200 },
    { ip: "192.168.0.5", packets: 980 },
    { ip: "192.168.0.2", packets: 870 },
    { ip: "192.168.0.3", packets: 650 },
    { ip: "192.168.0.4", packets: 500 },
  ],
}: TopTalkersProps) => {
  const maxPackets = Math.max(...data.map(d => d.packets));

  return (
    <Card className="w-[30%]">
      <CardHeader>
        <CardTitle>Top Talkers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {data.map((talker, idx) => {
            const widthPercent = (talker.packets / maxPackets) * 100;
            return (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium w-24">{talker.ip}</span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-red-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="text-sm w-12 text-right">{talker.packets}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTalkers;

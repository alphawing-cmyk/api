import { Badge } from "~/components/ui/badge";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/dashboard/api/route";

const platformColors: Record<string, string> = {
  tradestation: "bg-green-500",
  alpaca: "bg-yellow-500",
  coinbase: "bg-blue-500",
  interactive_brokers: "bg-black",
  oanda: "bg-amber-500",
};

const getPlatformColor = (platform: string) => {
  return platformColors[platform] || "bg-gray-500";
};

const PlatformCell = ({ data }: any) => {
  const { platforms } = useLoaderData<typeof loader>();

  return (
    <div className="text-center">
      {platforms.includes(data.platform) ? (
        <Badge className={`${getPlatformColor(data.platform)} text-white capitalize hover:${getPlatformColor(data.platform)}`}>
          {data.platform.replace("_"," ")}
        </Badge>
      ) : (
        <Badge variant="secondary">N/A</Badge>
      )}
    </div>
  );
};

export default PlatformCell;

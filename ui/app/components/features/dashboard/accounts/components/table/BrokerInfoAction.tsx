import { Badge } from "~/components/ui/badge";

const identifyBroker = (broker: string) => {
  switch (broker) {
    case "tradestation":
      return <Badge className="bg-blue-500 capitalize">{broker}</Badge>;
    default:
      return <Badge variant="default" className="capitalize">{broker}</Badge>;
  }
};

const BrokerInfoAction = ({ broker }: { broker: string }) => {
  return <div className="w-[100px] text-center">{identifyBroker(broker)}</div>;
};


export default BrokerInfoAction;
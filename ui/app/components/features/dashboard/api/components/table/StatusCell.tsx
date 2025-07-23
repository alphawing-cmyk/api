import { Badge } from "~/components/ui/badge";

const StatusCell = ({ data }: any) => {
  return (
    <div className="text-center">
      {data.status === "active" ? (
        <Badge variant="success">Active</Badge>
      ) : data.status === "disabled" ? (
        <Badge variant="destructive">Disabled</Badge>
      ) : (
        <Badge variant="secondary">N/A</Badge>
      )}
    </div>
  );
};

export default StatusCell;

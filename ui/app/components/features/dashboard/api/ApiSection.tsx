import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import Columns from "./components/table/Columns";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import MetricCard from "../common/MetricCard";
import { Anchor, ShieldCheck, PowerOff } from "lucide-react";
import { DataTableServerSide } from "~/components/ui/data-table-server-side";
import AddApiConnection from "./components/AddApiConnection";
import { loader, TableData } from "~/routes/dashboard/api/route";

interface ApiClientProps {
  data: TableData
}

export const ApiSection: React.FC<ApiClientProps> = ({data}) => {
  const {apiStats } =  useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const fetchRecords = async (
    pageIndex: number,
    pageSize: number,
    filters: Record<string, any>
  ) => {
    setIsFiltered(true);
    searchParams.set("page", pageIndex.toString());
    searchParams.set("size", pageSize.toString());
    searchParams.set("params", `${new URLSearchParams(filters).toString()}`);
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`API Connections (${data?.total ? data.total : 0})`}
          description="Manage your api connections here."
        />
        <AddApiConnection />
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-5 mb-3">
        <MetricCard
          loading={false}
          title="# of Api Connections"
          value={apiStats?.total ? apiStats.total : 0}
          icon={<Anchor className="h-6 w-6 text-muted-foreground" />}
          animation={true}
        />
        <MetricCard
          loading={false}
          title="# Active Connections"
          value={apiStats?.active ? apiStats.active : 0}
          icon={<ShieldCheck className="h-6 w-6 text-muted-foreground" />}
          animation={true}
        />
        <MetricCard
          loading={false}
          title="# Disabled Connections"
          value={apiStats?.disabled ? apiStats.disabled : 0}
          icon={<PowerOff className="h-6 w-6 text-muted-foreground" />}
          animation={true}
        />
      </div>
      <div className="overflow-y-auto">
        <DataTableServerSide 
            columns={Columns}
            data={data.items}
            searchKey={["platform","nickname"]}
            pageSize={data.size}
            totalRecords={data.total}
            fetchData={fetchRecords}
        />
      </div>
    </>
  );
};

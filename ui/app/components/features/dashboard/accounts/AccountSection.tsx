import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import Columns from "./components/table/Columns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import AddAccount from "./components/AddAccount";
import { DataTableServerSide } from "~/components/ui/data-table-server-side";
import { TableData } from "~/routes/dashboard.accounts";
import { useSearchParams } from "@remix-run/react";
import { useState } from "react";

interface AccountClientProps {
  data: TableData;
}

export const AccountSection: React.FC<AccountClientProps> = ({ data }) => {
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
          title={`Accounts (${data?.total})`}
          description="Manage your link trading accounts here"
        />
        <AddAccount />
      </div>
      <Separator />

      {data.total === 0 && !isFiltered ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <h2>No Account records present</h2>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-y-auto">
          <DataTableServerSide
            columns={Columns}
            data={data.items}
            searchKey={["nickname"]}
            pageSize={data.size}
            totalRecords={data.total}
            fetchData={fetchRecords}
          />
        </div>
      )}
    </>
  );
};

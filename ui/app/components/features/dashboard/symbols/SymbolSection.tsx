import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TableData } from "~/routes/dashboard.symbols";
import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import AddASymbol from "./components/AddSymbol";
import Columns from "./components/table/Columns";
import { DataTableServerSide } from "~/components/ui/data-table-server-side";
import type { User } from "~/root";

interface SymbolDataProps {
  data: TableData;
  user: User
}

export const SymbolSection: React.FC<SymbolDataProps> = ({ data, user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltered, setIsFiltered]     = useState<boolean>(false);

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
          title={`Symbols (${data?.total})`}
          description="Manage ticker symbols"
        />
        <AddASymbol userRole={user?.role} />
      </div>
      <Separator />

      {(data.total === 0 && !isFiltered)? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Ticker Symbols</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <h2>No ticker data is present</h2>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTableServerSide
          columns={Columns}
          data={data.items}
          searchKey={["name"]}
          pageSize={data.size}
          totalRecords={data.total}
          fetchData={fetchRecords}
        />
      )}
    </>
  );
};
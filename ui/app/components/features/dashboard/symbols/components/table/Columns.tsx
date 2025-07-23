import { ColumnDef } from "@tanstack/react-table";
import { DeleteAction } from "./DeleteAction";
import { EditAction } from "./EditAction";
import { calculateIndex } from "~/lib/utils";

export interface SymbolCols {
  id: number;
  symbol: string;
  name: string;
  industry?: string;
  market: string;
  market_cap?: string;
}

const Columns: ColumnDef<{ [key: string]: any }>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => (
      <p className="font-bold text-center">
        {calculateIndex() + row.index + 1}
      </p>
    ),
  },
  {
    accessorKey: "symbol",
    header: () => <div className="text-center">Symbol</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center font-bold">{row.original.symbol}</p>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{row.original.name}</p>
    ),
  },
  {
    id: "alt_names",
    header: () => <div className="text-center">Alternative Names</div>,
    cell: ({ row }) => {
      const altNames = row.original.alt_names;
      return (
        <div className="text-left px-2 py-1">
          {Array.isArray(altNames) && altNames.length > 0 ? (
            <div className="flex flex-col gap-1 rounded-md border p-2 bg-muted/20">
              {altNames.map((alt: any, index: number) => (
                <div
                  key={index}
                  className="text-xs flex justify-between border-b last:border-b-0 pb-1 last:pb-0"
                >
                  <span className="font-medium">
                    {alt.source}
                  </span>:
                  <span className="text-right">{alt.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-center italic">
              No alternate names
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "industry",
    header: () => <div className="text-center">Industry</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{row.original.industry}</p>
    ),
  },
  {
    accessorKey: "market",
    header: () => <div className="text-center">Market</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{row.original.market}</p>
    ),
  },
  {
    accessorKey: "market_cap",
    header: () => <div className="text-center">Market Cap</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{row.original.market_cap}</p>
    ),
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: ({ row }) => <EditAction data={row.original} />,
  },
  {
    id: "delete",
    header: () => <div className="text-center">Delete</div>,
    cell: ({ row }) => <DeleteAction data={row.original} />,
  },
];

export default Columns;

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string[];
  fetchData: (
    pageIndex: number,
    pageSize: number,
    filters: Record<string, any>
  ) => Promise<void>;
  pageSize: number;
  totalRecords: number;
}

export function DataTableServerSide<TData, TValue>({
  columns,
  data,
  searchKey,
  fetchData,
  pageSize,
  totalRecords,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const pageCount = Math.ceil(totalRecords / pageSize);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: pageCount,
  });

  useEffect(() => {
    fetchData(pagination.pageIndex + 1, pagination.pageSize, filters);
  }, [pagination, filters]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {searchKey.map((key: string, idx: number) => {
          return (
            <Input
              key={idx}
              placeholder={`Search ${key}...`}
              value={filters[key] ?? ""}
              onChange={(event) => {
                const newFilterValue = event.target.value;
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  [key]: newFilterValue,
                }));
              }}
              className="w-full md:max-w-sm mb-1"
            />
          );
        })}
      </div>
      <div className="text-left">
        <button
          type="button"
          className="focus:outline-none text-white bg-gray-500
                     font-medium rounded-sm text-xs px-2 py-1 mb-2"
          onClick={() => {
            searchKey.map(key => {
              setFilters((prevFilters) => {
                return {
                  [key]: ""
                }
              })
            })
          }}
        >
          Clear
        </button>
      </div>

      {/* Wrap the table in a ScrollArea for horizontal scrolling */}
      <ScrollArea className="rounded-md border h-[calc(80vh-220px)] w-full overflow-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

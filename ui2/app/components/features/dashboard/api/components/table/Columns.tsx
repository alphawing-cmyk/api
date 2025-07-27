import { ColumnDef } from "@tanstack/react-table";
import { EditAction } from "./EditAction";
import StatusCell from "./StatusCell";
import { DeleteAction } from "./DeleteAction";
import PlatformCell from "./PlatformCell";

export interface PlatformType{
  id: number;
  platform: string;
  user_id: number;
  api_key?: string;
  secret?: string;
  status?: string;
}

const Columns: ColumnDef<{[key: string]: any}>[] = [
  {
    accessorKey: "id",
    header: () => <span className="text-center">ID</span>,
    cell: ({ row }) => <p className="font-bold text-center">{row.original.id}</p>,
  },
  {
    accessorKey: "platform",
    header: () => <span className="text-center">Platform</span>,
    cell: ({ row }) => <PlatformCell data={row.original} />,
  },
  {
    accessorKey: "nickname",
    header: () => <span className="text-center">Nickname</span>,
    cell: ({ row }) => <p>{row.original.nickname}</p>,
  },
  {
    accessorKey: "status",
    header: () => <span className="text-center">Status</span>,
    cell: ({ row }) => <StatusCell data={row.original} />,
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
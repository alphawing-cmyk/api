import { ColumnDef } from "@tanstack/react-table";
import BrokerInfoAction from "./BrokerInfoAction";
import { formatDateFNS } from "~/lib/utils";
import AccountTypeInfoAction from "./AccountTypeInfoAction";
import EditAccountAction from "./EditAccountAction";
import DeleteAccountAction from "./DeleteAccountAction";

export interface AccountCols {
  id: number;
  accountNum: string;
  nickname?: string;
  broker: string;
  dateOpened: string;
  initialBalance: number;
  currentBalance: number;
  accountType: string;
  autoTrade: boolean;
}

const Columns: ColumnDef<{ [key: string]: any }>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => (
      <p className="font-bold text-center">{row.original.id}</p>
    ),
  },
  {
    accessorKey: "accountNum",
    header: () => <div className="text-center">Account Number</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{row.original.accountNum}</p>
    ),
  },
  {
    accessorKey: "nickname",
    header: () => <div className="text-center">Nickname</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{row.original.nickname}</p>
    ),
  },
  {
    accessorKey: "broker",
    header: () => <div className="text-center">Broker</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <BrokerInfoAction broker={row.original.broker} />
      </div>
    ),
  },
  {
    accessorKey: "dateOpened",
    header: () => <div className="text-center">Date Opened</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <p className="capitalize text-center">
          {formatDateFNS(row.original.dateOpened)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "initialBalance",
    header: () => <div className="text-center">Initial Balance</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <p>
          ${(Math.round(row.original.initialBalance * 100) / 100).toFixed(2)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "currentBalance",
    header: () => <div className="text-center">Current Balance</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <p>
          ${(Math.round(row.original.currentBalance * 100) / 100).toFixed(2)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "accountType",
    header: () => <div className="text-center">Account Type</div>,
    cell: ({ row }) => (
      <AccountTypeInfoAction account_type={row.original.accountType} />
    ),
  },
  {
    accessorKey: "autoTrade",
    header: () => <div className="text-center">Auto Trade</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{`${row.original.autoTrade}`}</p>
    ),
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: ({ row }) => (
      <EditAccountAction
        id={row.original.id}
        accountNum={row.original.accountNum}
        accountType={row.original.accountType}
        autoTrade={row.original.autoTrade}
        nickname={row.original.nickname}
        broker={row.original.broker}
        dateOpened={row.original.dateOpened}
        initialBalance={row.original.initialBalance}
        currentBalance={row.original.currentBalance}
      />
    ),
  },
  {
    id: "delete",
    header: () => <div className="text-center">Delete</div>,
    cell: ({ row }) => <DeleteAccountAction id={row.original.id} />,
  },
];

export default Columns;

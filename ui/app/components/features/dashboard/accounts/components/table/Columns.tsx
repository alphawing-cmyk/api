import { ColumnDef } from "@tanstack/react-table";
import BrokerInfoAction from "./BrokerInfoAction";
import { formatDateFNS } from "~/lib/utils";
import AccountTypeInfoAction from "./AccountTypeInfoAction";
import EditAccountAction from "./EditAccountAction";
import DeleteAccountAction from "./DeleteAccountAction";

export interface AccountCols {
  id: number;
  account_num: string;
  nickname?: string;
  broker: string;
  date_opened: string;
  initial_balance: number;
  current_balance: number;
  account_type: string;
  auto_trade: boolean;
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
    cell: ({ row }) => {
      const accountNum = row.original.account_num || "";
      const masked =
        accountNum.length > 4
          ? "*".repeat(accountNum.length - 4) + accountNum.slice(-4)
          : accountNum;

      return (
        <p className="text-center break-words whitespace-pre-wrap w-[100px] overflow-hidden font-mono">
          {masked}
        </p>
      );
    },
  },

  {
    accessorKey: "nickname",
    header: () => <div className="text-center">Nickname</div>,
    cell: ({ row }) => {
      const nickname = row.original.nickname || "";
      const truncated =
        nickname.length > 100 ? nickname.slice(0, 100) + "…" : nickname;

      return (
        <p className="capitalize text-center break-words whitespace-pre-wrap w-[100px] overflow-hidden">
          {truncated}
        </p>
      );
    },
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
          {formatDateFNS(row.original.date_opened)}
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
          ${(Math.round(row.original.initial_balance * 100) / 100).toFixed(2)}
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
          ${(Math.round(row.original.current_balance * 100) / 100).toFixed(2)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "accountType",
    header: () => <div className="text-center">Account Type</div>,
    cell: ({ row }) => (
      <AccountTypeInfoAction account_type={row.original.account_type} />
    ),
  },
  {
    accessorKey: "autoTrade",
    header: () => <div className="text-center">Auto Trade</div>,
    cell: ({ row }) => (
      <p className="capitalize text-center">{`${row.original.auto_trade}`}</p>
    ),
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: ({ row }) => (
      <EditAccountAction
        id={row.original.id}
        account_num={row.original.account_num}
        account_type={row.original.account_type}
        auto_trade={row.original.auto_trade}
        nickname={row.original.nickname}
        broker={row.original.broker}
        date_opened={row.original.date_opened}
        initial_balance={row.original.initial_balance}
        current_balance={row.original.current_balance}
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

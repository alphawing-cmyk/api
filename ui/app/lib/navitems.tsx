import {
  LayoutDashboard,
  DollarSign,
  Wallet,
  Ticket,
  UserRound,
  Bolt,
  Cog,
  LogOut,
} from "lucide-react";

export type UserLevel = "demo" | "client" | "admin" | "service" | null;

export interface NavItem {
  id: number;
  title: string;
  icon: JSX.Element;
  href: string;
  disabled: boolean;
  userLevel: UserLevel;
}

export const navitems: Array<NavItem> = [
  {
    id: 1,
    title: "Dashboard",
    icon: <LayoutDashboard className="mr-2 h-6 w-6" />,
    href: "/dashboard",
    disabled: false,
    userLevel: "demo",
  },
  {
    id: 2,
    title: "Accounts",
    icon: <DollarSign className="mr-2 h-6 w-6" />,
    href: "/dashboard/accounts",
    disabled: false,
    userLevel: "demo",
  },
  {
    id: 3,
    title: "Strategies",
    icon: <Wallet className="mr-2 h-6 w-6" />,
    href: "/dashboard/strategies",
    disabled: false,
    userLevel: "client",
  },
  {
    id: 4,
    title: "Symbols",
    icon: <Ticket className="mr-2 h-6 w-6" />,
    href: "/dashboard/symbols",
    disabled: false,
    userLevel: "client",
  },
  {
    id: 5,
    title: "User Management",
    icon: <UserRound className="mr-2 h-6 w-6" />,
    href: "/dashboard/user-manager",
    disabled: false,
    userLevel: "admin",
  },
  {
    id: 6,
    title: "API Management",
    icon: <Bolt className="mr-2 h-6 w-6" />,
    href: "/dashboard/api",
    disabled: false,
    userLevel: "admin",
  },
  {
    id: 7,
    title: "Settings",
    icon: <Cog className="mr-2 h-6 w-6" />,
    href: "/dashboard/settings",
    disabled: false,
    userLevel: "demo",
  },
  {
    id: 8,
    title: "Logout",
    icon: <LogOut className="mr-2 h-6 w-6" />,
    href: "/logout",
    disabled: false,
    userLevel: null,
  },
];

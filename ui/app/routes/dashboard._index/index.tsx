import MetricCard from "~/components/features/dashboard/common/MetricCard";
import { Landmark, DollarSign, Coins, Gavel } from "lucide-react";
import { LoaderFunctionArgs } from "@remix-run/node";
import ApiClient from "~/lib/apiClient";
import { useLoaderData, useMatches } from "@remix-run/react";
import { useEffect, useState } from "react";
import { redirect } from "@remix-run/node";
import { LiveEquityChart } from "~/components/features/dashboard/home/liveEquityChart";
import RecentTrades from "~/components/features/dashboard/home/RecentTrades";
import Watchlist from "~/components/features/dashboard/home/watchList";
import HistoricalChart from "~/components/features/dashboard/home/historicalChart";

export type DatasetTypes = {
  total_service_account: number | undefined | null;
  total_live_account: number | undefined | null;
  total_paper_account: number | undefined | null;
  total_accounts: number | undefined | null;
  current_balance: number | undefined | null;
  account_growth: number | undefined | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    let res = await ApiClient("py", "GET", "/account/stats", request, null);
    let cookieHeader;
    let data: { [key: string]: any } = {};

    if ("success" in res && res.success === true && "data" in res) {
      data = res.data;
    }

    if ("cookieHeader" in res && res.cookieHeader !== null && res.success) {
      cookieHeader = res.cookieHeader;
    }

    return Response.json(
      {
        data,
      },
      {
        status: 200,
        headers: cookieHeader
          ? {
              "Set-Cookie": cookieHeader,
            }
          : undefined,
      }
    );
  } catch {
    return redirect("/login");
  }
}

export default function DashboardHome() {
  const loaderData = useLoaderData<typeof loader>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatasetTypes>({
    total_service_account: null,
    total_live_account: null,
    total_paper_account: null,
    total_accounts: null,
    current_balance: null,
    account_growth: null,
  });

  const matches = useMatches();
  const rootData = matches.find((match) => match.id === "root");

  useEffect(() => {
    if ("data" in loaderData && loaderData.data) {
      setLoading(false);
      let data = loaderData.data;

      setData((prev) => {
        return {
          ...prev,
          ...{
            total_service_account: data.total_service_account,
            total_live_account: data.total_live_account,
            total_paper_account: data.total_paper_account,
            total_accounts: data.total_accounts,
            current_balance: data.current_balance,
            account_growth: data.account_growth,
          },
        };
      });
    }
  }, [loaderData]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-5">
        <MetricCard
          loading={loading}
          title="# of Accounts"
          value={data?.total_accounts || 0}
          icon={<Landmark className="h-6 w-6 text-muted-foreground" />}
          description={
            <span>
              <b>{data?.total_paper_account || 0}</b> Paper Account(s),
              <b>{data?.total_live_account || 0}</b> Live Account(s)
            </span>
          }
          animation={true}
          decimalPlaces={0}
        />
        <MetricCard
          loading={loading}
          title="Total Equity"
          value={`$${data?.current_balance?.toFixed(2) || (0).toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
          description={
            data?.account_growth && data?.account_growth > 0
              ? `+${data.account_growth.toFixed(2)}%`
              : data?.account_growth && data?.account_growth < 0
              ? `-${data.account_growth.toFixed(2)}%`
              : "+0.00%"
          }
          animation={true}
        />
        <MetricCard
          loading={loading}
          title="Total Profit"
          value={-177.45}
          icon={<Coins className="h-6 w-6 text-muted-foreground" />}
          description={
            data?.account_growth && data?.account_growth > 0
              ? `+${data.account_growth.toFixed(2)}%`
              : data?.account_growth && data?.account_growth < 0
              ? `-${data.account_growth.toFixed(2)}%`
              : "+0.00%"
          }
          animation={true}
          decimalPlaces={2}
        />
        <MetricCard
          title="# Active Trades"
          value={4}
          icon={<Gavel className="h-6 w-6 text-muted-foreground" />}
          description="Total trades still open"
          animation={true}
          decimalPlaces={0}
        />
      </div>
      <div>
        <LiveEquityChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <RecentTrades />
          <Watchlist />
        </div>
        <div className="my-5">
          <HistoricalChart />
        </div>
      </div>
    </>
  );
}

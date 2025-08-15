import { useState } from "react";
import Select from "react-select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { loader } from "~/routes/_index";
import { ArrowRight, ArrowDownRight, Minus, ArrowUpRight } from "lucide-react";
import { parseISO } from "date-fns";


export interface HistoricalItem {
  ticker_id?: number;
  symbol?: string;
  market?: string;
  industry?: string;
  custom_id?: string;
  milliseconds?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  adj_close?: number;
  volume?: number;
  vwap?: number;
  timestamp?: string;
  transactions?: number;
  source?: string;
  duration?: string;
}

export interface WatchlistItem{
   market: string;
   symnol: string;
   historical: HistoricalItem[] | [];
}


function priceColor(delta: number) {
  if (delta > 0) return "text-green-600";
  if (delta < 0) return "text-red-600";
  return "text-muted-foreground"; // gray for 0
}

function ChangePill({ last, prev }: { last: number; prev: number }) {
  const delta = last - prev;
  const pct = prev ? (delta / prev) * 100 : 0;
  const Icon = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${priceColor(
        delta
      )}`}
    >
      <Icon className="h-4 w-4" />
      {delta === 0
        ? "0.00 (0.00%)"
        : `${delta.toFixed(2)} (${pct.toFixed(2)}%)`}
    </span>
  );
}

function findLastPrice(data: WatchlistItem) {
   if(data.historical && data.historical.length >= 1){
      let dataAdj = data.historical.map((e: HistoricalItem) => {
          return {...e, [timestamp: parseISO(e?.timestamp)}]
      })

   }
}




const Watchlist = () => {
  const { watchListData, tickersData } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  console.log(watchListData);

  const watchListDataSorted = watchListData?.sort(
    (a: { symbol: string }, b: { symbol: string }) => {
      a.symbol.localeCompare(b.symbol);
    }
  );

  const tickerOptions = tickersData
    ?.sort((a: { symbol: string }, b: { symbol: string }) =>
      a.symbol.localeCompare(b.symbol)
    )
    .map((ticker: { [key: string]: string }) => ({
      value: `${ticker.market}-${ticker.symbol}`,
      label: `${ticker.symbol} — ${ticker.name} (${ticker.market})`,
    }));

  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const handleAddTicker = () => {
    if (!selectedOption) return;
    const symbol = selectedOption.value.split("-").at(1) as string;
    const market = selectedOption.value.split("-").at(0) as string;
    const data = {
      symbol,
      market,
      action: "add_watchlist_item",
    };
    submit(data, { method: "POST" });
    setSelectedOption(null);
  };

  const handleRemoveTicker = (symbol: string, market: string) => {
    console.log("Hit removed ticker");
    console.log(symbol);
    const data = {
      symbol,
      market,
      action: "remove_watchlist_item",
    };
    submit(data, { method: "POST" });
    setWatchlist(watchlist.filter((item) => item !== symbol));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Watchlist</CardTitle>
        <CardDescription>
          Track your favorite stocks and crypto tickers.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center">
          <div className="w-full">
            <Select
              options={tickerOptions}
              value={selectedOption}
              onChange={(option) => setSelectedOption(option)}
              placeholder="Search and select a ticker"
              isClearable
              instanceId="watchlist-item-select"
            />
          </div>
          <Button onClick={handleAddTicker}>Add</Button>
        </div>
        {watchListDataSorted?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Watchlist</h4>
            <ScrollArea className="max-h-48 pr-2">
              <div className="space-y-2">
                {watchListDataSorted.map(
                  (item: {
                    market: string;
                    symbol: string;
                    historical: HistoricalItem[] | [];
                  }) => {
                    const q = {last: 20, prev_close: 13.00};
                    const delta = q.last - q.prev_close;

                    return (
                      <div
                        key={item.symbol}
                        className="flex items-center justify-between border rounded p-2 hover:bg-muted transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {item.symbol.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.symbol.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-semibold ${priceColor(
                                  delta
                                )}`}
                              >
                                {q.last.toFixed(2)}
                              </span>
                              <ChangePill last={q.last} prev={q.prev_close} />
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveTicker(item.symbol, item.market)
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  }
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {searchHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Search History</h4>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, idx) => (
                <Badge key={idx} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          You can track all your selected symbols here.
        </p>
      </CardFooter>
    </Card>
  );
};

export default Watchlist;

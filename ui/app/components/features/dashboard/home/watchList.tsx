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


const Watchlist = () => {
  const { watchListData, tickersData } = useLoaderData<typeof loader>();
  console.log(tickersData);

  const tickerOptions = tickersData?.map(
    (ticker: { [key: string]: string }) => ({
      value: `${ticker.market}-${ticker.symbol}`,
      label: `${ticker.symbol} — ${ticker.name} (${ticker.market})`,
    })
  );

  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const handleAddTicker = () => {
    if (!selectedOption) return;
    const symbol = selectedOption.value.split("-").at(1) as string;


    setSelectedOption(null); // Clear selection
  };

  const handleRemoveTicker = (symbol: string) => {
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

        {watchListData?.watchlist?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Watchlist</h4>
            <ScrollArea className="max-h-48 pr-2">
              <div className="space-y-2">
                {watchListData?.watchlist?.map(
                  (item: { market: string; symbol: string }) => (
                    <div
                      key={item.symbol}
                      className="flex items-center justify-between border rounded p-2 hover:bg-muted transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {item.symbol.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{item.symbol}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTicker(item.symbol)}
                      >
                        Remove
                      </Button>
                    </div>
                  )
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

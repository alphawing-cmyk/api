import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState<string>("");

  const handleAddTicker = () => {
    const trimmed = tickerInput.trim().toUpperCase();
    if (trimmed && !watchlist.includes(trimmed)) {
      setWatchlist([trimmed, ...watchlist]);
    }
    if (trimmed && !searchHistory.includes(trimmed)) {
      setSearchHistory([trimmed, ...searchHistory]);
    }
    setTickerInput("");
  };

  const handleRemoveTicker = (symbol: string) => {
    setWatchlist(watchlist.filter((item) => item !== symbol));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Watchlist</CardTitle>
        <CardDescription>Track your favorite stocks and crypto tickers.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add ticker symbol (e.g., AAPL, BTC)"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
          />
          <Button onClick={handleAddTicker}>Add</Button>
        </div>

        {watchlist.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Watchlist</h4>
            <ScrollArea className="max-h-48 pr-2">
              <div className="space-y-2">
                {watchlist.map((symbol) => (
                  <div
                    key={symbol}
                    className="flex items-center justify-between border rounded p-2 hover:bg-muted transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{symbol.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{symbol}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTicker(symbol)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
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
          You can track both stocks and crypto assets. Tickers are stored in memory.
        </p>
      </CardFooter>
    </Card>
  );
};

export default Watchlist;

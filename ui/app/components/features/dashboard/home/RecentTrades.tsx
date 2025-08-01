import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { TradesData } from "~/lib/data";
import { useEffect, useState } from "react";
import PaginationWrapper from "~/components/dashboard/PaginationWrapper";

const RecentTrades = () => {
  const [numPages, setNumPages] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);

  const handleActivePage = (page: number, action: string) => {
    let newPage = page;

    if (action === "increment") {
      newPage = page + 1;
    } else if (action === "decrement") {
      newPage = page - 1;
    }
    if (newPage < 1) {
      newPage = numPages;
    } else if (newPage > numPages) {
      newPage = 1;
    }

    setActivePage(newPage);
    console.log(`Changed to page: ${newPage}`);
  };

  useEffect(() => {
    setNumPages(Math.floor(numPages / 25) + 1);
  }, [TradesData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>Total of 250 trades this month</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[400px]">
        <div className="space-y-6">
          {TradesData.length >= 1
            ? TradesData.map((trade) => {
                return (
                  <div 
                    className="flex items-center hover:bg-gray-100  transition-all duration-100 ease-in-out p-2 cursor-pointer" 
                    key={trade.id}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {trade.symbol[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        *****6408
                      </p>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {trade.strategy_name}
                          {trade.live ? (
                            <Badge variant="destructive" className="ml-2">
                              Live Trade
                            </Badge>
                          ) : (
                            <Badge variant="success" className="ml-2">
                              Paper Trade
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 font-bold">
                          Symbol: AAPL / 10 Shares
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto font-medium">+$1,589.32</div>
                  </div>
                );
              })
            : ""}
        </div>
      </CardContent>
      <CardFooter>
        <PaginationWrapper
          numPages={numPages}
          currentPage={activePage}
          handleActivePage={handleActivePage}
        />
      </CardFooter>
    </Card>
  );
};

export default RecentTrades;
import { useState, useRef, useEffect } from "react";
import {
  VictoryChart,
  VictoryTheme,
  VictoryCandlestick,
  VictoryZoomContainer,
} from "victory";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

const chartDataMap = {
  AAPL: [
    { x: "2025-07-28", open: 100, close: 105, high: 110, low: 95 },
    { x: "2025-07-29", open: 106, close: 102, high: 108, low: 100 },
    { x: "2025-07-30", open: 103, close: 108, high: 112, low: 101 },
    { x: "2025-07-31", open: 109, close: 115, high: 118, low: 107 },
    { x: "2025-08-01", open: 116, close: 120, high: 123, low: 114 },
  ],
  TSLA: [
    { x: "2025-07-28", open: 210, close: 215, high: 220, low: 205 },
    { x: "2025-07-29", open: 216, close: 212, high: 218, low: 210 },
    { x: "2025-07-30", open: 213, close: 218, high: 222, low: 211 },
    { x: "2025-07-31", open: 219, close: 225, high: 228, low: 217 },
    { x: "2025-08-01", open: 226, close: 230, high: 233, low: 224 },
  ],
  MSFT: [
    { x: "2025-07-28", open: 300, close: 305, high: 310, low: 295 },
    { x: "2025-07-29", open: 306, close: 302, high: 308, low: 300 },
    { x: "2025-07-30", open: 303, close: 308, high: 312, low: 301 },
    { x: "2025-07-31", open: 309, close: 315, high: 318, low: 307 },
    { x: "2025-08-01", open: 316, close: 320, high: 323, low: 314 },
  ],
};

export function CandleChart() {
  const [symbol, setSymbol] = useState("AAPL");
  const data = chartDataMap[symbol];

  // Responsive width handling
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute zoom domain from OHLC data
  const minLow = Math.min(...data.map((d) => d.low));
  const maxHigh = Math.max(...data.map((d) => d.high));
  const xDomain = [0, data.length - 1];

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-xl">Candlestick Chart</CardTitle>
        <Select value={symbol} onValueChange={setSymbol}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AAPL">AAPL</SelectItem>
            <SelectItem value="TSLA">TSLA</SelectItem>
            <SelectItem value="MSFT">MSFT</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="h-[400px] w-full px-4">
          {width > 0 && (
            <VictoryChart
              domainPadding={{ x: 30 }}
              theme={VictoryTheme.material}
              height={400}
              width={width}
              containerComponent={
                <VictoryZoomContainer
                  zoomDomain={{
                    x: xDomain,
                    y: [minLow - 5, maxHigh + 5], 
                  }}
                />
              }
            >
              <VictoryCandlestick
                data={data.map((d: any, i: any) => ({ ...d, x: i }))}
                candleColors={{ positive: "#22c55e", negative: "#ef4444" }}
              />
            </VictoryChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

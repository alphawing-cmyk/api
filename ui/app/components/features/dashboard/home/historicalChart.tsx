import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Select from "react-select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const timeframes = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1mo", label: "1 Month" },
  { value: "1y", label: "1 Year" },
];

const tickers = [
  { value: "AAPL", label: "Apple" },
  { value: "GOOGL", label: "Google" },
  { value: "BTC", label: "Bitcoin" },
  { value: "ETH", label: "Ethereum" },
];

const generateFakeData = (symbol: string, timeframe: string) => {
  const now = Date.now();
  const multiplier =
    {
      "1m": 60 * 1000,
      "5m": 5 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
      "1w": 7 * 24 * 60 * 60 * 1000,
      "1mo": 30 * 24 * 60 * 60 * 1000,
      "1y": 365 * 24 * 60 * 60 * 1000,
    }[timeframe] ?? 60 * 1000;

  const points = 50;
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(
      now - (points - i) * (multiplier / points)
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return {
      time,
      price: parseFloat((Math.sin(i / 5) * 10 + 100 + Math.random() * 5).toFixed(2)),
    };
  });
};

const HistoricalChart = () => {
  const [selectedTicker, setSelectedTicker] = useState(tickers[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[3]);
  const [data, setData] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    const newData = generateFakeData(
      selectedTicker.value,
      selectedTimeframe.value
    );
    setData(newData);
  }, [selectedTicker, selectedTimeframe]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 gap-2 mt-4">
          <div className="flex flex-col w-full sm:w-60">
            <label className="text-sm font-medium text-muted-foreground mb-1">
              Select Ticker
            </label>
            <Select
              options={tickers}
              value={selectedTicker}
              onChange={(val) => val && setSelectedTicker(val)}
              className="text-sm"
            />
          </div>
          <div className="flex flex-col w-full sm:w-60">
            <label className="text-sm font-medium text-muted-foreground mb-1">
              Select Timeframe
            </label>
            <Select
              options={timeframes}
              value={selectedTimeframe}
              onChange={(val) => val && setSelectedTimeframe(val)}
              className="text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                minTickGap={20}
                tick={{
                  fontSize: 12,
                  angle: -45,
                  textAnchor: "end",
                  dy: 10,
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={["auto", "auto"]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;

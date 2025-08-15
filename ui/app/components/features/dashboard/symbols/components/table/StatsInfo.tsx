import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, BarChart } from "recharts";
import { TrendingUp, Activity, DollarSign, Users, Clock, BarChart3, MonitorCheck, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "~/components/ui/chart";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { ChartConfig } from "~/components/ui/chart";


// Types
export type StatCard = {
  label: string;
  value: string | number;
  sublabel?: string;
  delta?: string; // e.g. "+4.2% WoW"
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type SeriesPoint = { date: string; value: number; [k: string]: number };

export interface StatsModalProps {
  title?: string;
  description?: string;
  statCards?: StatCard[]; // 4–8 cards
  series?: SeriesPoint[]; // for the line chart
  seriesKeys?: string[]; // supports multiple lines
  details?: Array<{ name: string; value: string | number }>; // 2‑column list
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const defaultCards: StatCard[] = [
  { label: "Active Users", value: "12,481", delta: "+5.1% MoM", icon: Users },
  { label: "Conversion", value: "4.63%", delta: "+0.3% WoW", icon: TrendingUp },
  { label: "Revenue", value: "$84,120", delta: "+8.9%", icon: DollarSign },
  { label: "Avg. Session", value: "6m 42s", delta: "-0.8%", icon: Clock },
  { label: "Engagement", value: "73.2%", delta: "+2.4%", icon: Activity },
  { label: "NPS", value: 48, delta: "+3", icon: Heart },
  { label: "Churn", value: "2.1%", delta: "-0.2%", icon: BarChart3 },
  { label: "Uptime", value: "99.98%", delta: "±0.00%", icon: MonitorCheck as any },
];

const defaultSeries: SeriesPoint[] = Array.from({ length: 24 }).map((_, i) => ({
  date: `2025-07-${(i + 1).toString().padStart(2, "0")}`,
  value: 60 + Math.round(20 * Math.sin(i / 3) + (Math.random() * 10 - 5)),
  revenue: 50 + Math.round(25 * Math.cos(i / 4) + (Math.random() * 8)),
}));

const defaultDetails: Array<{ name: string; value: string | number }> = [
  { name: "Top Region", value: "US West" },
  { name: "New Signups", value: 1842 },
  { name: "ARPU", value: "$6.73" },
  { name: "MQLs", value: 392 },
  { name: "Tickets Resolved", value: 1240 },
  { name: "Median Latency", value: "122 ms" },
  { name: "API Errors", value: "0.12%" },
  { name: "MRR Growth", value: "+3.2%" },
  { name: "Top Channel", value: "Organic Search" },
  { name: "A/B Test Winner", value: "Variant B" },
  { name: "SLA Breaches", value: 0 },
  { name: "Avg. CPU", value: "41%" },
];


const interactiveChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const interactiveChartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

export default function StatsInfo({
  title = "Performance Overview",
  description = "A quick look at your key metrics and recent trends.",
  statCards = defaultCards,
  series = defaultSeries,
  seriesKeys = ["value", "revenue"],
  details = defaultDetails,
  open,
  onOpenChange,
}: StatsModalProps) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof interactiveChartConfig>("desktop");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className="text-center">
        <Button variant="indigo" className="shadow-sm">
            Open
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[1100px] w-[95vw] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <DialogTitle className="text-2xl md:text-3xl font-semibold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Scrollable body to keep header/footer fixed height */}
        <ScrollArea className="max-h-[80vh]">
          {/* Top: shadcn Chart example */}
          <div className="px-6 pt-6">
            <Card className="rounded-2xl border-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base md:text-lg">Traffic</CardTitle>
                    <p className="text-xs text-muted-foreground">Showing total visitors for the last 6 months</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setActiveChart("desktop")}>
                      Desktop
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setActiveChart("mobile")}>
                      Mobile
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={interactiveChartConfig} className="h-[220px] w-full">
                  <BarChart accessibilityLayer data={interactiveChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                    <Bar dataKey={activeChart} radius={6} fill={`var(--color-${String(activeChart)})`} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="px-6 py-6 space-y-8">
            {/* Stat Cards Grid */}
            <section>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.slice(0, 8).map((card, idx) => (
                  <Card key={card.label + idx} className="rounded-2xl border-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-muted-foreground font-medium">
                          {card.label}
                        </CardTitle>
                        {card.icon ? (
                          <card.icon className="h-5 w-5 opacity-70" aria-hidden />
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl md:text-3xl font-semibold tabular-nums">
                        {card.value}
                      </div>
                      {card.sublabel || card.delta ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          {card.sublabel ?? card.delta}
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Line Chart */}
            <section className="rounded-2xl border bg-card">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">Trend</h3>
                  <p className="text-sm text-muted-foreground">
                    Last {series.length} days
                  </p>
                </div>
                <div className="h-[280px] md:h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
                      <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                      <Tooltip formatter={(v: any) => (typeof v === "number" ? v.toLocaleString() : v)} />
                      <Legend />
                      {seriesKeys.map((k, i) => (
                        <Line
                          key={k}
                          type="monotone"
                          dataKey={k}
                          dot={false}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Two‑Column Details */}
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-3">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.map((row, idx) => (
                  <div
                    key={row.name + idx}
                    className="flex items-baseline justify-between rounded-xl border bg-card/50 px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">{row.name}</span>
                    <span className="font-medium text-base md:text-lg tabular-nums">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

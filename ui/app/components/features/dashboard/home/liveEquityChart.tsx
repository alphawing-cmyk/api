import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '~/components/ui/card';

const data = [
  { time: '7 AM', value: 27000 },
  { time: '8 AM', value: 27350 },
  { time: '9 AM', value: 27500 },
  { time: '10 AM', value: 27680 },
  { time: '11 AM', value: 27900 },
  { time: '12 PM', value: 27800 },
  { time: '1 PM', value: 28000 },
  { time: '2 PM', value: 27100 },
  { time: '3 PM', value: 27300 },
];

export function LiveEquityChart() {
  return (
    <Card className="w-full mx-auto shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">
          Equity Trend
        </h2>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="yellowShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={['dataMin - 200', 'dataMax + 200']}
                hide
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '0.5rem',
                  border: 'none',
                }}
                labelStyle={{ fontSize: 12, color: '#475569' }}
                itemStyle={{ color: '#facc15' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#facc15"
                strokeWidth={2}
                fill="url(#yellowShade)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

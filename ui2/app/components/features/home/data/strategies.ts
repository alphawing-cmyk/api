export const stats = {
  num_of_symbols: 900,
  sharpe_ratio: 1.55,
  avg_return: 24.8,
};

export const strategies = [
  {
    id: 1,
    option: "Momentum System (MM-200)",
    value: "strategy:MM-200",
    default: true,
  },
  {
    id: 2,
    option: "SMA Crossover (SMA-100)",
    value: "strategy:SMA-200",
    default: false,
  },
  {
    id: 3,
    option: "Donchian Channel (DC-100)",
    value: "strategy:DC-200",
    default: false,
  },
];

export const metrics = [
  {
    id: 1,
    option: "Sharpe Ratio",
    value: "metric:sharpe",
    default: true,
    rechartValue: "SharpeRatio",
  },
  {
    id: 2,
    option: "Returns",
    value: "metric:returns",
    default: false,
    rechartValue: "Returns",
  },
];

export const strategyData = [
  {
    strategy: "strategy:MM-200",
    data: [
      { label: "Jan", SharpeRatio: 1.23, Returns: 12 },
      { label: "Feb", SharpeRatio: 0.89, Returns: 23 },
      { label: "Mar", SharpeRatio: 1.45, Returns: 5 },
      { label: "Apr", SharpeRatio: 0.75, Returns: -5 },
      { label: "May", SharpeRatio: 1.98, Returns: 20 },
      { label: "Jun", SharpeRatio: 1.12, Returns: -10 },
      { label: "Jul", SharpeRatio: 0.67, Returns: 12 },
      { label: "Aug", SharpeRatio: 1.76, Returns: 15 },
      { label: "Sept", SharpeRatio: 0.92, Returns: 25 },
      { label: "Oct", SharpeRatio: 1.34, Returns: -10 },
    ],
  },
  {
    strategy: "strategy:SMA-200",
    data: [
      { label: "Jan", SharpeRatio: 1.5, Returns: 10 },
      { label: "Feb", SharpeRatio: 1.3, Returns: -15 },
      { label: "Mar", SharpeRatio: 0.6, Returns: 32 },
      { label: "Apr", SharpeRatio: 1.4, Returns: 23 },
      { label: "May", SharpeRatio: 0.2, Returns: -12 },
      { label: "Jun", SharpeRatio: 0.1, Returns: 40 },
      { label: "Jul", SharpeRatio: 0.4, Returns: 23 },
      { label: "Aug", SharpeRatio: 1.0, Returns: 12 },
      { label: "Sept", SharpeRatio: 1.2, Returns: 5 },
      { label: "Oct", SharpeRatio: 0.95, Returns: 28 },
    ],
  },
  {
    strategy: "strategy:DC-200",
    data: [
      { label: "Jan", SharpeRatio: 1.45, Returns: 32 },
      { label: "Feb", SharpeRatio: 0.89, Returns: 16 },
      { label: "Mar", SharpeRatio: 0.72, Returns: 5 },
      { label: "Apr", SharpeRatio: 1.2, Returns: -4 },
      { label: "May", SharpeRatio: 1.95, Returns: 2 },
      { label: "Jun", SharpeRatio: 0.63, Returns: 7 },
      { label: "Jul", SharpeRatio: 1.78, Returns: 9 },
      { label: "Aug", SharpeRatio: 0.98, Returns: -15 },
      { label: "Sept", SharpeRatio: 1.15, Returns: 12 },
      { label: "Oct", SharpeRatio: 1.34, Returns: 5 },
    ],
  },
];

export interface TradeItem {
  id: number;
  symbol: string;
  units: number;
  price: number;
  total: string;
  account_id: number;
  live: boolean;
  strategy_id: number;
  strategy_name: string;
}


export const TradesData: Array<TradeItem> = [
  {
    id: 1, 
    symbol: "AAPL",
    units: 10,
    price: 143.59,
    total: "-$1,459.66",
    account_id: 31,
    live: true,
    strategy_id: 1,
    strategy_name: "Strategy 1"
  },
  {
    id: 2, 
    symbol: "MNQM24",
    units: 1,
    price: 17274.25,
    total: "$17,274.25",
    account_id: 35,
    live: false,
    strategy_id: 2,
    strategy_name: "Strategy 2"
  },
  {
    id: 3, 
    symbol: "MESM24",
    units: 1,
    price: 5786.24,
    total: "$5,786.24",
    account_id: 31,
    live: true,
    strategy_id: 3,
    strategy_name: "Strategy 3"
  },
];



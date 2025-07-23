import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ScaleLoader from "react-spinners/ScaleLoader";

interface ChartParams {
  title: string | undefined;
  loading: boolean;
  xDataKey: string | undefined;
  yDataKey: string | undefined;
  data: Array<object>;
}

const AreaChartRE = ({
  title,
  loading,
  xDataKey,
  yDataKey,
  data,
}: ChartParams) => {
  return loading ? (
    <div className="min-h-[450px] flex flex-col justify-center items-center">
      <ScaleLoader color="#fcf300" />
    </div>
  ) : (
    <div>
      <div className="px-[20px] text-center text-[24px] fsm-reg">{title}</div>
      <ResponsiveContainer width="100%" minHeight={450}>
        <AreaChart
          width={550}
          height={400}
          data={data}
          title={title}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey ? xDataKey : ""} fontSize={12} dy={5} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={yDataKey ? yDataKey : ""}
            stroke="#2176ff"
            strokeLinecap="round"
            strokeWidth={4}
            fill="rgba(0,0,0,0.3)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartRE;

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  
  interface ChartProps {
    data: Array<{}>;
    xKey: string;
    dataKey: string;
    stroke?: string;
    dollarFormatting: boolean;
    yValue?: string
  }
  
  
  const formatYAxis = (dollarFormatting: boolean, tickItem: string) => {
      if(dollarFormatting){
          return `$${tickItem.toLocaleString()}`;
      } else {
          return `${tickItem}`;
      }
  }
  
  
  const LinechartRE = ({ data, xKey, dataKey, stroke, dollarFormatting, yValue }: ChartProps) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#201e1f', fontWeight: 'bold' }} tickMargin={10} />
          <YAxis  
              tickFormatter={(tickItem : string)=>{ return formatYAxis(dollarFormatting, tickItem)}} 
              tick={{ fontSize: 12, fill: '#201e1f', fontWeight: 'bold' }}
           />
          <Tooltip />
          <Legend wrapperStyle={{fontSize: 13, paddingTop: 5}}  />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke ? stroke : "#82ca9d"}
            name={yValue}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  export default LinechartRE;
  
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ScaleLoader } from "react-spinners";

interface ChartProps {
  data: Array<{}> | undefined | null;
  loading: boolean;
  fillColor: string | undefined;
  title: string | undefined;
  tooltip: boolean;
  xVal: string;
  yVal: string;
  w: number;
  h: number;
  hoverColor: string;
  refresh: boolean;
  xlabFontSize: number;
  ylabFontSize: number;
}


interface DataPoint {
  [key: string]: number | undefined;
}


function BarChartD3({
  data,
  loading,
  fillColor,
  title,
  xVal,
  yVal,
  hoverColor,
  refresh,
  w,
  h,
  xlabFontSize,
  ylabFontSize,
  tooltip = false,
}: ChartProps) {
  const margin = { top: 30, right: 30, bottom: 90, left: 50 };
  let width = w - margin.left - margin.right;
  let height = h - margin.top - margin.bottom;
  let svgRef = useRef<SVGSVGElement>(null);

  const generateChart = (data: any) => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d: { [key: string]: any }) => d[xVal]))
      .padding(0.2);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .attr("font-size", `${xlabFontSize}px`)
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y)).attr("font-size", `${ylabFontSize}px`);

    // Bars
    svg
      .selectAll("mybar")
      .data(data)
      .join("rect")
      // @ts-ignore
      .attr("x", (d) => x(d[xVal]))
      .attr("width", x.bandwidth())
      .attr("fill", fillColor ? fillColor : "#000000")
      .attr("height", (d) => height - y(0))
      .attr("y", (d) => y(0));

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .attr("class", "fsm-reg")
      .text(title ? title : "Test Bar Chart");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "10px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "4px")
      .style("color", "#fff");

    if (tooltip) {
      svg
        .selectAll("rect")
        .on("mouseover", (event) => {
          let d: { [key: string]: string | number } | undefined = d3
            .select(event.target)
            .datum() as { [key: string]: string | number } | undefined;
          tooltip
            .style("visibility", "visible")
            .html(
              `${xVal}: ${d ? d[xVal] : null}, ${yVal}: ${d ? d[yVal] : null}`,
            );
          d3.select(event.target).transition().attr("fill", hoverColor);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", (event) => {
          tooltip.style("visibility", "hidden");
          d3.select(event.target)
            .transition()
            .attr("fill", fillColor ? fillColor : null);
        });
    }

    // Animation
    svg
      .selectAll("rect")
      .transition()
      .duration(800)
      // @ts-ignore
      .attr("y", d => y(d.Value))
      // @ts-ignore
      .attr("height", d => height - y(d.Value))
      .delay((d, i) => {
        return i * 100;
      });
  };

  useEffect(() => {
    generateChart(data);
  }, [data, refresh]);

  return loading ? (
    <div className="min-h-[450px] flex flex-col justify-center items-center">
      <ScaleLoader loading={loading} color="#f5a524" />
    </div>
  ) : (
    <svg
      id="barchartd3"
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
    ></svg>
  );
}

export default BarChartD3;

import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useEffect, useState } from "react";
import Color from "color";
import { useRef } from "react";
import { Loading } from "./ApplicationsCount";

export default function TwoStatePieChart({
  fetchFunction,
  chartColor,
  isAccepted,
}) {
  const [chartData, setChartData] = useState(null);
  const label = useRef(null);
  const chartConfig = useRef({});
  const initChart = (data) => {
    chartConfig.current = {};
    const color = Color(chartColor || "rgb(139, 190, 252)");
    const darkenRatio = 1 / (2 * data.length);
    label.current = data[0].internDuration ? "internDuration" : "internType";
    data.forEach((element, idx) => {
      chartConfig.current[`${idx}`] = {
        label: element[label.current],
        color: color.darken(darkenRatio * idx).hex(),
      };
    });
    data = data.map((element, idx) => {
      return {
        ...element,
        fill: `var(--color-${idx})`,
      };
    });
    setChartData(data);
  };

  useEffect(() => {
    const fetchCount = async () => {
      const response = await fetchFunction();
      if (response.status === 200) {
        initChart(response.data);
      }
    };
    fetchCount();
  }, []);

  return (
    <ChartContainer
      config={chartConfig.current}
      className="mx-auto aspect-square max-h-[250px]"
    >
      {!chartData && <Loading color="#808080" />}
      <PieChart
        margin={{
          top: 12,
          buttom: 12,
          left: 12,
          right: 12,
        }}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="w-12" hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey={isAccepted ? "countAccepted" : "countTotal"}
          nameKey={label.current}
          stroke="0"
          label
        />
      </PieChart>
    </ChartContainer>
  );
}

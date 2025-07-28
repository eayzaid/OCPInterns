import { getApplicationsFields } from "../Fetch";
import { useEffect, useState } from "react";
import { Loading } from "./ApplicationsCount";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LabelList,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const chartColorCount = "#bbf7d0"; // green-200
const chartColorAccepted = "#16a34a"; // green-600

const chartConfig = {
  countAccepted: {
    label: "Accepted",
    color: chartColorAccepted,
  },
  countTotal: {
    label: "Total",
    color: chartColorCount,
  },
};

export default function ApplicationsFieldsBarChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      const response = await getApplicationsFields();
      if (response.status === 200) {
        setChartData(response.data);
      }
    };
    fetchCount();
  }, []);

  return (
    <>
      {!chartData && <Loading />}
      {chartData && (
        <ScrollArea className="h-[480px] w-full">
          <ChartContainer
            className="min-h-[1500px] w-[500px]"
            config={chartConfig}
          >
            <BarChart
              layout="vertical"
              accessibilityLayer
              data={chartData}
              margin={{
                right: 16,
                left : 28
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis type="number"  />
              <YAxis
                dataKey="internField"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="countAccepted"
                layout="vertical"
                fill="var(--color-countAccepted)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="countTotal"
                layout="vertical"
                fill="var(--color-countTotal)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ScrollArea>
      )}
    </>
  );
}

import { getDepartmentsOverview } from "../Fetch";
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

const chartColorMentors = "#2563eb"; // blue-600
const chartColorMentees = "#60a5fa"; // blue-300

const chartConfig = {
  totalMentors: {
    label: "Mentors",
    color: chartColorMentors,
  },
  totalMentees: {
    label: "Mentees",
    color: chartColorMentees,
  },
};

export default function DepartmentsBarChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      const response = await getDepartmentsOverview();
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
            className="min-h-[7000px] w-[500px]"
            config={chartConfig}
          >
            <BarChart
              layout="vertical"
              accessibilityLayer
              data={chartData}
              margin={{
                right: 16,
                left : 20
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis type="number" />
              <YAxis
                dataKey="departmentName"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="totalMentors"
                layout="vertical"
                fill="var(--color-totalMentors)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalMentees"
                layout="vertical"
                fill="var(--color-totalMentees)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ScrollArea>
      )}
    </>
  );
}

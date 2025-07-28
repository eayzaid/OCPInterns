import { getApplicationsSubmission } from "../Fetch";
import { useEffect, useState } from "react";
import { Loading } from "./ApplicationsCount";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const chartColor = "8ec5ff";

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: chartColor,
  },
};

export default function ApplicationsLineChart({ timeRange }) {
  const [chartData, setchartData] = useState(null);
  const [filtredChartData, setFiltredChartData] = useState(null);

  const filterEntries = (data) => {
    const dataToFilter = data || chartData;
    if (timeRange === "90d") {
      setFiltredChartData(chartData);
      return;
    }
    const now = new Date();
    const limitDate = new Date(
      now.getTime() -
        (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90) *
          24 *
          60 *
          60 *
          1000
    );
    setFiltredChartData(
      dataToFilter.filter((entry) => {
        return new Date(entry.date) >= limitDate;
      })
    );
  };

  useEffect(() => {
    const fetchCount = async () => {
      const response = await getApplicationsSubmission();
      if (response.status === 200) {
        setchartData(response.data);
        filterEntries(response.data);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    if (chartData) filterEntries();
  }, [timeRange]);

  return (
    <>
      {!filtredChartData && <Loading />}
      {filtredChartData && (
        <ChartContainer className="max-h-[250px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={filtredChartData}
            margin={{
              top: 12,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = value.split("-");
                return `${date[1]}/${date[2]}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="submissions"
              type="natural"
              stroke={`#${chartColor}`}
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      )}
    </>
  );
}

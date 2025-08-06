import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Loading } from "./ApplicationsCount";
import { getApplicationsStatus } from "../Fetch";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "#D1D5DB", // lighter gray
  },
  accepted: {
    label: "Accepted",
    color: "#4ADE80", // lighter green
  },
  refused: {
    label: "Refused",
    color: "#F87171", // lighter red
  },
  pfs: {
    label: "Pending Files Submission",
    color: "#C4B5FD", // lighter purple
  },
  unknown: {
    label: "Unknown",
    color: "#E5E7EB", // light neutral
  },
};

export default function ApplicationsStatus() {
  const [chartData, setChartData] = useState(null);

  const initChart = (data) => {
    data = data.map((element) => {
      return {
        ...element,
        fill: `var(--color-${element.status})`,
      };
    });
    setChartData(data);
  };

  useEffect(() => {
    const fetchCount = async () => {
      const response = await getApplicationsStatus();
      if (response.status === 200) {
        initChart(response.data);
      }
    };
    fetchCount();
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      {!chartData && <Loading color="#808080" />}
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="w-12" hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          stroke="0"
          label
        />
      </PieChart>
    </ChartContainer>
  );
}

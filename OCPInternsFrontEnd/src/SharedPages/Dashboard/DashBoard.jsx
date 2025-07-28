import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card";
import ApplicationCount from "./Charts/ApplicationsCount";
import TwoStatePieChart from "./Charts/TwoStatePieChart";
import { getInternshipsTypes, getInternshipsDuration } from "./Fetch";
import { Switch } from "../../Components/ui/switch";
import { Label } from "../../Components/ui/label";
import { useState } from "react";
import ApplicationsStatus from "./Charts/ApplicationsStatus";
import ApplicationsLineChart from "./Charts/ApplicationsLineChart";
import { Separator } from "../../Components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplicationsFieldsBarChart from "./Charts/ApplicationsFieldsBarChart";
import DepartmentsBarChart from "./Charts/DepartmentsBarChart";

const ApplicationsOverview = () => {
  const [isAcceptedApplication, setIsAcceptedApplication] = useState(false);
  return (
    <div className="flex-1">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Applications Overview</CardTitle>
          <div className="flex gap-1">
            <Label>Accepted Applications Only</Label>
            <Switch
              checked={isAcceptedApplication}
              onCheckedChange={() =>
                setIsAcceptedApplication(!isAcceptedApplication)
              }
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div>
            <h1>Internships Types : </h1>
            <TwoStatePieChart
              fetchFunction={getInternshipsTypes}
              isAccepted={isAcceptedApplication}
              chartColor="#B9F8CF"
            />
            <h1>Internships Duration : </h1>
            <TwoStatePieChart
              fetchFunction={getInternshipsDuration}
              isAccepted={isAcceptedApplication}
            />
          </div>
          <Separator />
          <div>
            <h1>Internships Status :</h1>
            <ApplicationsStatus />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SelectTime = ({ setTimeRange, timeRange }) => {
  return (
    <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
      <SelectTrigger
        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
        aria-label="Select a value"
      >
        <SelectValue placeholder="Last 3 months" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value="90d" className="rounded-lg">
          Last 3 months
        </SelectItem>
        <SelectItem value="30d" className="rounded-lg">
          Last 30 days
        </SelectItem>
        <SelectItem value="7d" className="rounded-lg">
          Last 7 days
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

const ApplicationsLineChartCard = () => {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Applications per Day</CardTitle>
          <CardDescription>
            This line chart represents how many applications were submitted
            within the selected time period, helping track submission trends
            over time.
          </CardDescription>
        </div>
        <SelectTime
          timeRange={timeRange}
          setTimeRange={(value) => setTimeRange(value)}
        />
      </CardHeader>
      <CardContent>
        <ApplicationsLineChart timeRange={timeRange} />
      </CardContent>
    </Card>
  );
};

const ApplicationsFieldsBarChartCard = () => {
  return (
    <Card className="flex-1 min-w-0">
      <CardHeader>
        <CardTitle>Internships Fields</CardTitle>
        <CardDescription>
          Breakdown of applications by internship field, showing total
          submissions and accepted applications for each technical domain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ApplicationsFieldsBarChart />
      </CardContent>
    </Card>
  );
};

const DepartmentsBarChartCard = () => {
  return (
    <Card className="flex-1 min-w-0">
      <CardHeader>
        <CardTitle>Departments Overview</CardTitle>
        <CardDescription>
          Visualization of mentors and mentees in each department, showing how
          mentoring resources and internship participants are distributed across
          the organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DepartmentsBarChart />
      </CardContent>
    </Card>
  );
};

export default function DashBoard() {
  return (
    <div className="h-full space-y-4 bg-green-200 p-2 pr-6">
      <header className="flex flex-col items-center gap-4 xl:flex-row xl:items-start justify-between">
        <article>
          <h1 className="text-5xl font-bigtitle text-green-800">
            Applications Dashboards
          </h1>
          <p className="text-xl font-casualfont text-gray-500">
            make your decision making faster , with the overall look to your
          </p>
        </article>
        <article>
          <ApplicationCount />
        </article>
      </header>
      <main className="flex flex-col xl:flex-row gap-2">
        <ApplicationsOverview />
        <section className="flex-2 flex flex-col gap-2">
          <ApplicationsLineChartCard />
          <div className="flex flex-col 2xl:flex-row gap-2">
            <ApplicationsFieldsBarChartCard />
            <DepartmentsBarChartCard />
          </div>
        </section>
      </main>
    </div>
  );
}

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../Components/ui/table";
import { Input } from "../../Components/ui/input";
import { Button } from "../../Components/ui/button";
import { Label } from "@radix-ui/react-label";
import StatusBadge from "../../Components/CustomUi/applicationStatusBadge";
import { formatValidStringToDate } from "../../Utils/FormatDate";

const SearchComponent = () => {
  return (
    <div className="bg-green-400 border-green-700 border-1 shadow-2xl rounded p-4 mb-4">
      <Label className="font-bold text-2xl text-green-50 p-2 font-bigtitle">
        Search for a Specific Candidate
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Full name : First name + Last Name"
          className="border rounded px-3 py-2 w-full bg-green-400 font-casual text-white focus:outline-none"
        />
        <Button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Search
        </Button>
      </div>
    </div>
  );
};


const ApplicationRow = ({ application , onSelect }) => {
  return (
    <TableRow onClick={ () => onSelect(application.applicationId) }>
      <TableCell className="py-1">{ application.fullName }</TableCell>
      <TableCell>{application.education.schoolName}</TableCell>
      <TableCell>{application.generalInfo.internType}</TableCell>
      <TableCell>{formatValidStringToDate(application.createdAt)}</TableCell>
      <TableCell><StatusBadge status={application.status}/></TableCell>
    </TableRow>
  );
};

export default function ApplicationTable({applications , onSelect}) {
  return (
    <div className="bg-green-200 border-green-700 shadow-2xl border-1 rounded  p-4 mb-4">
      <SearchComponent />
      <ScrollArea className="w-full h-[32rem]">
        <Table className="bg-gray-300 rounded-sm overflow-hidden text-xs lg:text-sm h-full">
          <TableHeader className="sticky top-0">
            <TableRow className="sticky top-0">
              <TableHead>Full Name</TableHead>
              <TableHead>School Name</TableHead>
              <TableHead>Internship Type</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Application Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications && applications.map((element , idx) =>{
              return <ApplicationRow key={idx} application={element} onSelect={onSelect}/>
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

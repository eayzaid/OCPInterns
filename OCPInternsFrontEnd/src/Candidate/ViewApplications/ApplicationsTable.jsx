import StatusBadge from "../../Components/CustomUi/applicationStatusBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../Components/ui/table";

import { formatValidStringToDate } from "../../Utils/FormatDate";


//application { applicationId , createdAt , generalInfo.internType ,status }

const ApplicationRow = ({ application }) => {
  return (
    <TableRow>
      <TableCell className="py-9">{application.applicationId}</TableCell>
      <TableCell>{formatValidStringToDate (application.createdAt )}</TableCell>
      <TableCell>{application.generalInfo.internType}</TableCell>
      <TableCell>
        <StatusBadge status={application.status} /> 
      </TableCell>
    </TableRow>
  );
};

//applications -> { currentApplication , oldApplications}
function ApplicationsTable({ applications }) {
  return (
    <Table className="bg-gray-300 rounded-sm overflow-hidden text-xs lg:text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>ApplicationID</TableHead>
          <TableHead>SubmissionDate</TableHead>
          <TableHead>Internship Type</TableHead>
          <TableHead>Application Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          applications.currentApplication && <ApplicationRow application={ applications.currentApplication } />
        }
        {applications.oldApplications.map((element) => {
          return <ApplicationRow application={element} />;
        })}
      </TableBody>
    </Table>
  );
}

export default ApplicationsTable;

import { toast } from "sonner";
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
import { downloadApplication } from "./Fetch";

//application { applicationId , createdAt , generalInfo.internType ,status }

const ApplicationRow = ({ application, downloadApplication }) => {
  return (
    <TableRow>
      <TableCell className="py-9">{application.applicationId}</TableCell>
      <TableCell>{formatValidStringToDate(application.createdAt)}</TableCell>
      <TableCell>{application.generalInfo.internType}</TableCell>
      <TableCell>
        <StatusBadge
          onClick={downloadApplication}
          status={application.status}
        />
      </TableCell>
    </TableRow>
  );
};

//applications -> { currentApplication , oldApplications}
function ApplicationsTable({ applications }) {
  //this is just intiate the download on clicking
  const onClickHandler = async (applicationId, status) => {
    if (status !== "accepted") return;
    toast.promise(downloadApplication(applicationId), {
      success: "your letter is ready to download",
      error:
        "Something went wrong with your download , try again later , or contact the Admin",
    });
    const response = await downloadApplication(applicationId);
    if (response.status !== 200) toast;
  };

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
        {applications.currentApplication && (
          <ApplicationRow
            downloadApplication={() =>
              onClickHandler(
                applications.currentApplication.applicationId,
                applications.currentApplication.status
              )
            }
            application={applications.currentApplication}
          />
        )}
        {applications.oldApplications.map((element) => {
          return <ApplicationRow application={element} />;
        })}
      </TableBody>
    </Table>
  );
}

export default ApplicationsTable;

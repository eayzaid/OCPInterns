import ApplicationTable from "./ApplicationTable";
import ApplicationProfile from "./ApplicationProfile";
import ApplicationController from "./ApplicationController";
import { useEffect, useState } from "react";
import { useAuth } from "../../Hooks";
import {
  fetchApplications,
  fetchApplication,
  fetchLocations,
  updateApplication,
} from "./Fetch";

export default function ApplicationManager() {
  const [paginationMetaData, setPaginationMetaData] = useState({
    page: 1,
    totalPages: null,
  });
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState(undefined);
  const [locations, setLocations] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    //intial fetching of applications , locations
    const fetchData = async () => {
      try {
        const newApplicationsPromise = fetchApplications(
          accessToken,
          paginationMetaData.page
        );
        
        //fetch only if location is null
        if (!locations) {
          const locationsPromise = fetchLocations(accessToken);
          setLocations(await locationsPromise);
        }
        
        const newApplications = await newApplicationsPromise;
        setApplications(newApplications.applications);
        
        // Update totalPages separately to avoid infinite loop
        if (newApplications.totalPages !== paginationMetaData.totalPages) {
          setPaginationMetaData(prev => ({
            ...prev,
            totalPages: newApplications.totalPages,
          }));
        }
      } catch (error) {
      }
    };
    fetchData();
  }, [paginationMetaData.page, accessToken]); // Added accessToken to dependencies

  const onSelectCandiate = async (applicationId) => {
    if (!application || applicationId !== application.applicationId) {
      const selectedApplication = await fetchApplication(
        accessToken,
        applicationId
      );
      setApplication(selectedApplication);
    }
  };

  //update the application method
  const onUpdate = async (updatedShard, originalApplication) => {
    let updatedDocument = null;

    //check if the application was accepted and then rejected ( avoiding updating the database with unmeaningful data according to context)
    //like previous (mentor , departement) in case of status that's not accepted
    if (
      updatedShard.status !== "accepted" &&
      originalApplication.status === "accepted"
    ) {
      const { mentor, startDate, endDate, department, ...neededPart } =
        originalApplication;
      updatedDocument = { ...neededPart, status: updatedShard.status };
    } else {
      updatedDocument = { ...originalApplication, ...updatedShard };
    }
    const response = await updateApplication(
      accessToken,
      originalApplication.applicationId,
      updatedDocument
    );
    if (response.status !== 200) {
      alert("update document wasn't succesfull");
    } else {
      //update the applicaton overview in the table ( changing the status only )
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === originalApplication.applicationId
            ? { ...app, status: updatedShard.status }
            : app
        )
      );
      setApplication(updatedDocument);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 bg-green-50">
      <div
        id="candidateTable"
        className="flex flex-col gap-8 xl:flex-row w-full"
      >
        <div className="xl:flex-3 ">
          <ApplicationTable
            setPage={(value) =>
              setPaginationMetaData(prev => ({ ...prev, page: value }))
            }
            {...paginationMetaData}
            applications={applications}
            onSet={setApplications}
            onSelect={onSelectCandiate}
          />
        </div>
        <div className="xl:flex-1">
          <ApplicationProfile application={application} />
        </div>
      </div>
      <div className="xl:flex-1 mt-2 w-full">
        <ApplicationController
          locations={locations}
          application={application}
          internshipGeneralInfo={application && application.generalInfo}
          onUpdate={(updatedApplication) =>
            onUpdate(updatedApplication, application)
          }
        />
      </div>
    </div>
  );
}

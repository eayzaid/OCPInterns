import { useForm } from "react-hook-form";
import { DatePickerForm, SelectForm } from "../../Components/CustomUi/Inputs";
import { Card, CardContent, CardTitle } from "../../Components/ui/card";
import { Form } from "../../Components/ui/form";
import { ApplicationStatus } from "./Constants";
import { Button } from "../../Components/ui/button";
import { useEffect } from "react";
import { useState } from "react";
import { applicationReviewFormValidation } from "../../FormSchemaValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { json } from "zod";

const InternshipInfomations = ({ internshipGeneralInfo }) => {
  return (
    <Card className="flex-1 p-1 border-green-700 bg-green-200 shadow-2xl border-1 rounded-sm">
      {internshipGeneralInfo ? (
        <>
          <CardTitle className="font-bigtitle font-bold text-2xl text-green-600">
            Internship Information
          </CardTitle>
          <CardContent className="grid grid-cols-2 gap-2 h-full text-green-950 font-casualfont">
            <p>Internship Type : </p>
            <p>{internshipGeneralInfo.internType}</p>
            <p>Internship Duration :</p>
            <p>{internshipGeneralInfo.internDuration}</p>
            <p>Internship Field : </p>
            <p>{internshipGeneralInfo.internField}</p>
          </CardContent>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h1 className="font-bigtitle text-2xl text-green-600 text-center">
            Select a Candidate
          </h1>
        </div>
      )}
    </Card>
  );
};

export default function ApplicationController({
  internshipGeneralInfo,
  application,
  locations,
  onUpdate,
}) {
  const formObject = useForm({
    resolver: yupResolver(applicationReviewFormValidation),
    defaultValues: {
      status: application?.status || "",
      mentor: {
        mentorId: application?.mentor?.mentorId || "",
        fullName: application?.mentor?.fullName || "",
      },
      startDate: application?.startDate
        ? new Date(application.startDate)
        : null,
      endDate: application?.endDate ? new Date(application.endDate) : null,
      department: {
        name: application?.department?.name || "",
        sousDepartment: application?.department?.sousDepartment || "",
      },
    },
  });

  const [isDisabled, setIsDisabled] = useState(
    // this for the allowing the form submission only in accepting state
    application?.status !== "accepted"
  );
  const [subDepartmentMentors, setSubDepartmentMentors] = useState({
    sousDepartments: [],
    mentors: [],
  });
  const [isDisabledSecond, setIsDisabledSecond] = useState([]); // this for allowing the from submission is second step when choosing a departement

  //this function used to filer mentors with the same interest as the candidate
  const filterInterest = (mentors) => {
    return mentors
      .filter((mentor) =>
        mentor.fields.includes(internshipGeneralInfo.internField)
      )
      .map((element) => {
        //to be compatible with the selection input { id , value = displayed }
        return {
          id: element.mentorId,
          value: element.mentorFullName,
        };
      });
  };

  //this side effect to track the user changes
  useEffect(() => {
    const status = formObject.watch("status");
    if (status) {
      setIsDisabled(status !== "accepted");
    }
  }, [formObject.watch("status")]);

  //update the Select form for SubDepartment
  useEffect(() => {
    const department = formObject.watch("department.name") || "";
    const emptyValue = {
      sousDepartments: [],
      mentors: [],
    };
    if (department) {
      const foundDepartment = locations.find(
        (loc) => loc.departmentName === department
      );
      if (foundDepartment) {
        const info =
          {
            sousDepartments: foundDepartment.sousDepartments,
            mentors: filterInterest(foundDepartment.mentors),
          } || emptyValue;
        setSubDepartmentMentors(info);
        setIsDisabledSecond(false);
      } else {
        setSubDepartmentMentors(emptyValue);
        setIsDisabledSecond(true);
      }
    } else {
      setSubDepartmentMentors(emptyValue);
      setIsDisabledSecond(true);
    }
  }, [formObject.watch("department.name")]);

  //update the fullName of the mentor based on the selection of mentorId
  useEffect(() => {
    const mentorId = formObject.watch("mentor.mentorId");
    if (mentorId) {
      const selectedMentor = subDepartmentMentors.mentors.find(
        (mentor) => mentor.id === mentorId
      );
      if (selectedMentor) {
        formObject.setValue("mentor.fullName", selectedMentor.value, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    }
  }, [formObject.watch("mentor.mentorId")]);

  // Reset the form whenever `application` prop changes
  useEffect(() => {
    formObject.reset({
      status: application?.status || "",
      mentor: {
        mentorId: application?.mentor?.mentorId || "",
        fullName: application?.mentor?.fullName || "",
      },
      startDate: application?.startDate
        ? new Date(application.startDate)
        : null,
      endDate: application?.endDate ? new Date(application.endDate) : null,
      department: {
        name: application?.department?.name || "",
        sousDepartment: application?.department?.sousDepartment || "",
      },
    });
  }, [application, formObject.reset]);

  const onSubmit = (data) => {
    onUpdate(data);
  };

  return (
    <div className="flex flex-col xl:flex-row justify-around gap-2 p-2 w-full h-full border-green-700 shadow-2xl border-1 rounded-sm">
      <InternshipInfomations internshipGeneralInfo={internshipGeneralInfo} />
      <div
        className={
          "flex-2" +
          (!internshipGeneralInfo
            ? " opacity-50 pointer-events-none select-none"
            : "")
        }
      >
        <Card className="w-full h-full p-2 border-green-700  bg-green-200 shadow-2xl border-1 rounded-sm">
          <CardTitle className="font-bigtitle font-bold text-2xl text-green-600">
            Internship Status
          </CardTitle>
          <CardContent className="text-green-950 font-casualfont">
            <Form {...formObject}>
              <form
                onSubmit={formObject.handleSubmit(onSubmit)}
                className="grid grid-cols-1 xl:grid-cols-2 gap-2"
              >
                <div className="w-9/10">
                  <SelectForm
                    control={formObject.control}
                    fieldName="status"
                    fieldLabel="Current Status"
                    selectItems={ApplicationStatus}
                    className="w-full border-1 border-green-950"
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 w-full xl:w-auto">
                  <SelectForm
                    control={formObject.control}
                    fieldName="department.name"
                    fieldLabel="Department"
                    selectItems={locations.map((element) => {
                      if (element) return element.departmentName;
                    })}
                    isDisabled={isDisabled}
                    className="w-full border-1 border-green-950"
                  />
                  <SelectForm
                    control={formObject.control}
                    fieldName="department.sousDepartment"
                    fieldLabel="Sub Department"
                    selectItems={subDepartmentMentors.sousDepartments}
                    isDisabled={isDisabled || isDisabledSecond}
                    className="w-full border-1 border-green-950"
                  />
                  <DatePickerForm
                    control={formObject.control}
                    fieldName="startDate"
                    fieldLabel="Start Date"
                    isDisabled={isDisabled}
                    className="text-black"
                  />
                  <DatePickerForm
                    control={formObject.control}
                    fieldName="endDate"
                    fieldLabel="End Date"
                    isDisabled={isDisabled}
                    className="text-black"
                  />
                  <SelectForm
                    control={formObject.control}
                    fieldName="mentor.mentorId"
                    fieldLabel="Mentorship"
                    selectItems={subDepartmentMentors.mentors}
                    isDisabled={
                      isDisabled ||
                      isDisabledSecond ||
                      (subDepartmentMentors.mentors &&
                        subDepartmentMentors.mentors.length === 0)
                    }
                    className="w-full border-1 border-green-950"
                  />
                  <Button
                    className="self-end"
                    variant="default"
                    type="submit"
                    disabled={
                      (isDisabled || isDisabledSecond) &&
                      formObject.watch("status") === "accepted"
                    }
                  >
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

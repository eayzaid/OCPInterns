// here you can take a look over all the form schemas used in this project
import * as yup from "yup";
import { Degrees, JobTypes, ProficiencyLanguageLevel } from "../Data";
import {
  InternshipDurations,
  InternshipTypesFrancophone,
  OCPMajorFields,
} from "../Data";
import { ApplicationStatus } from "./SharedPages/ApplicationManager/Constants";
import { endOfDay } from "date-fns";

export const loginSchemaValidation = yup.object().shape({
  email: yup
    .string()
    .required("the email field is required")
    .email("the field should be a valid email"),
  password: yup
    .string()
    .min(8, "the password should be at least 8 caracteres long")
    .required("the password field is required"),
});

export const SignUpSchemaValidation = yup.object().shape({
  firstName: yup.string().required("your first name is required"),
  lastName: yup.string().required("your last name is required"),
  email: yup
    .string()
    .required("the email field is required")
    .email("the field should be a valid email"),
  password: yup
    .string()
    .min(8, "the password should be at least 8 caracteres long")
    .required("the password field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not Match")
    .required("the confirmation of your password is required"),
});

export const educationSchemaValidation = yup.object().shape({
  schoolName: yup
    .string()
    .required("the school or university name is required"),
  degree: yup
    .string()
    .required("the title is required")
    .oneOf(Degrees, "The degree entred is not eligble"),
  branch: yup
    .string()
    .required("the branch and the area of interest are required"),
  startDate: yup.date().required("the start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "The end date cannot be before the start date"),
});

export const experienceSchemaValidation = yup.object().shape({
  organizationName: yup.string().required("the organization name is required"),
  jobType: yup
    .string()
    .oneOf(JobTypes, "The given job type is not valid")
    .required("the job type is required"),
  startDate: yup.date().required("the start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "The end date cannot be before the start date"),
});

export const languageSchemaValidation = yup.object().shape({
  languageName: yup.string().required("the language name is required"),
  proficiencyLevel: yup
    .string()
    .oneOf(ProficiencyLanguageLevel, "The proficiency level is not valid")
    .required("the proficiency level is required"),
});

export const skillSchemaValidation = yup.object().shape({
  skill: yup.string().required("the skill name is required"),
});

export const GeneralInfoschemaValidation = yup.object().shape({
  internType: yup
    .string()
    .oneOf(InternshipTypesFrancophone, "Please select a valid internship type")
    .required("Internship type is required"),
  internDuration: yup
    .string()
    .oneOf(InternshipDurations, "Please select a valid internship duration")
    .required("Internship duration is required"),
  internField: yup
    .string()
    .oneOf(OCPMajorFields, "Please select a valid internship field")
    .required("Internship field is required"),
});
export const applicationReviewFormValidation = yup.object().shape({
    status: yup
        .string()
        .required("Status is required")
        .oneOf(ApplicationStatus, "Invalid application status"),
    mentor: yup
        .object({
          fullName : yup.string(),
          mentorId : yup.string(),
        })
        .when("status", {
            is: "accepted",
            then: (schema) => schema.required("Mentor is required when status is accepted"),
            otherwise: (schema) => schema.strip(), // Remove this field when not accepted
        }),
    startDate: yup
        .date()
        .when("status", {
            is: "accepted",
            then: (schema) => schema.required("Start date is required when status is accepted"),
            otherwise: (schema) => schema.strip(), // Remove this field when not accepted
        }),
    endDate: yup
        .date()
        .when("status", {
            is: "accepted",
            then: (schema) => schema
                .required("End date is required when status is accepted")
                .min(yup.ref("startDate"), "The end date cannot be before the start date"),
            otherwise: (schema) => schema.strip(), // Remove this field when not accepted
        }),
    department: yup
        .object({
            name: yup.string().required("Department name is required"),
            sousDepartment: yup.string().required("Sub-department is required"),
        })
        .when("status", {
            is: "accepted",
            then: (schema) => schema.required("Department information is required when status is accepted"),
            otherwise: (schema) => schema.strip(), // Remove this field when not accepted
        }),
});

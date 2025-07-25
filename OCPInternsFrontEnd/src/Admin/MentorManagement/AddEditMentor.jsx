import { Button } from "../../Components/ui/button";
import { InputForm, SelectForm } from "../../Components/CustomUi/Inputs";
import { useForm } from "react-hook-form";
import { useLayoutEffect, useRef, useState } from "react";
import { Form } from "../../Components/ui/form";
import { OCPMajorFields } from "../../../Data";
import { SelectField } from "./MentorManager";
import { SignUpSchemaValidation } from "../../FormSchemaValidation";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Badge } from "../../Components/ui/badge";
import { Label } from "../../Components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchUser, register, updateMentor } from "./Fetch";
import { toast } from "sonner";

//registration when no mentor have been passed , an edit when the mentor have been passed as a prop

export default function AddEditMentor({ mentor, departments, onEditing }) {
  // Extend the validation schema to require departmentName to be one of departments
  const ExtendedSignUpSchemaValidation = yup.object().shape({
    ...SignUpSchemaValidation.fields,
    departmentName: yup
      .string()
      .oneOf(departments, "Please select a valid department")
      .required("Department is required"),
    password: mentor
      ? yup.string().nullable().optional()
      : yup
          .string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters"),
    confirmPassword: mentor
      ? yup.string().nullable().optional()
      : yup
          .string()
          .required("Please confirm your password")
          .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const formObject = useForm({
    resolver: yupResolver(ExtendedSignUpSchemaValidation),
  });
  const [fields, setFields] = useState([]);
  const initialRefresh = useRef(true);

  useLayoutEffect(() => {
    const fetchMentorData = async () => {
      try {
        if (mentor && mentor.mentorId) {
          const response = await fetchUser(
            `?role=mentor&userId=${mentor.mentorId}`
          );

          if (response.status === 200) {
            const mentorInitialData = response.data;
            formObject.setValue("firstName", mentorInitialData.firstName);
            formObject.setValue("lastName", mentorInitialData.lastName);
            formObject.setValue("email", mentorInitialData.email);
            formObject.setValue("departmentName", mentor.departmentName);
            setFields(mentor.fields || []); // Add fallback for fields
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        throw new Error();
      }
    };

    if (!initialRefresh.current) {
      toast.promise(fetchMentorData, {
        loading: "Loading...",
        success: () => {
          return `${data.firstName} ${data.lastName} has been created`;
        },
        error: `Something went wrong fetching the mentor`,
      });
    }
    initialRefresh.current = false;
  }, [mentor]); // Add mentor as dependency

  const onSubmit = (data) => {
    data = { fields, ...data }; //assemble all infos
    let { confirmPassword, ...userData } = data; //take the confirm part Off

    //if register ===> mentor is undefined
    if (!mentor) {
      toast.promise(register(userData), {
        loading: "Loading...",
        success: () => {
          return `${data.firstName} ${data.lastName} has been created`;
        },
        error: `There was a problem during the deletion of ${data.firstName} ${data.lastName}`,
      });
    } //update the mentor
    else {
      userData = { userId: mentor.mentorId, ...userData };
      const mentorFullName = `${data.firstName} ${data.lastName}`;
      toast.promise(updateMentor(userData), {
        loading: "Loading...",
        success: () => {
          const displayedEditedMentor = {
            ...mentor,
            mentorFullName,
            fields: userData.fields,
            departmentName: userData.departmentName,
          };
          onEditing(displayedEditedMentor);
          return `${mentorFullName} has been updated`;
        },
        error: `There was a problem during the update of ${mentorFullName}`,
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-green-100">
      <DialogHeader>
        <DialogTitle>Create or Edit profile</DialogTitle>
        <DialogDescription>
          Create or Make change so a Mentor Profile here . Click save when
          you're done.
        </DialogDescription>
      </DialogHeader>
      <Form {...formObject}>
        <form
          onSubmit={formObject.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-start gap-2 w-full text-black"
        >
          <InputForm
            control={formObject.control}
            placeholder={"Ex : Ayman"}
            fieldLabel="Enter your First Name : "
            fieldName="firstName"
          />
          <InputForm
            control={formObject.control}
            placeholder="Exemple : Zaidane"
            fieldLabel="Enter your Last Name : "
            fieldName="lastName"
          />
          <InputForm
            control={formObject.control}
            placeholder="Exemple : ayman@example.com"
            fieldLabel="Enter your Email Address : "
            fieldName="email"
          />
          <InputForm
            control={formObject.control}
            placeholder="Enter your password"
            fieldLabel="Enter your Password : "
            fieldName="password"
            type="password"
          />
          <InputForm
            control={formObject.control}
            placeholder="Confirm your password"
            fieldLabel="Confirm your Password : "
            fieldName="confirmPassword"
            type="password"
          />
          <SelectForm
            control={formObject.control}
            placeholder="Select Department"
            fieldLabel="Department"
            fieldName="departmentName"
            selectItems={departments}
            className="w-full text-black"
          />
          <Label>Fields</Label>
          <div className="flex flex-wrap gap-1  bg-emerald-900 p-1 w-9/10 rounded">
            {fields.map((field, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-green-950 bg-green-100 border-1 border-green-300 shadow-2xs"
              >
                {field}
                <div className="scale-75">
                  <X
                    className="text-red-700"
                    onClick={() => {
                      setFields(fields.filter((element) => element !== field));
                    }}
                  />
                </div>
              </Badge>
            ))}
            <SelectField
              className="h-0.5 placeholder-white"
              placeholder="+ Add"
              onChange={(value) => {
                if (!fields.includes(value)) setFields([value, ...fields]);
              }}
              selectValues={OCPMajorFields}
              value=""
            />
          </div>
          <div className="flex justify-between w-9/10">
            <Button variant="default" className="bg-green-800">
              Finish
            </Button>
            <Button type="reset" variant="destructive">
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}

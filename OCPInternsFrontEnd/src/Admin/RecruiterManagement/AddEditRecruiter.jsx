import { Button } from "../../Components/ui/button";
import { InputForm } from "../../Components/CustomUi/Inputs";
import { useForm } from "react-hook-form";
import { useLayoutEffect } from "react";
import { Form } from "../../Components/ui/form";
import { SignUpSchemaValidation } from "../../FormSchemaValidation";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog";
import { Label } from "../../Components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerRecruiter, updateRecruiter } from "./Fetch";
import { toast } from "sonner";
import * as yup from "yup";

// Registration when no recruiter has been passed, edit when recruiter has been passed as a prop
export default function AddEditRecruiter({ recruiter, onSuccess }) {
  const schema = recruiter
    ? SignUpSchemaValidation.shape({
        password: yup.string().nullable().notRequired(),
        confirmPassword: yup
          .string()
          .nullable()
          .notRequired()
          .oneOf([yup.ref("password")], "Passwords must match"),
      })
    : SignUpSchemaValidation;

  const formObject = useForm({
    resolver: yupResolver(schema),
  });

  useLayoutEffect(() => {
    if (recruiter) {
      formObject.setValue("firstName", recruiter.firstName || "");
      formObject.setValue("lastName", recruiter.lastName || "");
      formObject.setValue("email", recruiter.email || "");
    } else {
      formObject.reset();
    }
  }, [recruiter]);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data; // Remove confirm password

      if (!recruiter) {
        // Creating a new recruiter
        toast.promise(registerRecruiter(userData), {
          loading: "Creating recruiter...",
          success: (response) => {
            if (response.status === 200) {
              // Pass the new recruiter data to onSuccess
              const newRecruiter = {
                ...userData,
                userId: response.data.userId || Date.now().toString(), // fallback if no userId returned
              };
              onSuccess && onSuccess(newRecruiter, true);
            }
            return "Recruiter created successfully";
          },
          error: "Failed to create recruiter",
        });
      } else {
        // Editing existing recruiter
        const updatedUserData = { userId: recruiter.userId, ...userData };
        toast.promise(updateRecruiter(updatedUserData), {
          loading: "Updating recruiter...",
          success: (response) => {
            if (response.status === 200) {
              // Pass the updated recruiter data to onSuccess
              const updatedRecruiter = {
                ...recruiter,
                ...userData,
              };
              onSuccess && onSuccess(updatedRecruiter, false);
            }
            return "Recruiter updated successfully";
          },
          error: "Failed to update recruiter",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-green-100">
      <DialogHeader>
        <DialogTitle>
          {recruiter ? "Edit Recruiter Profile" : "Create Recruiter Profile"}
        </DialogTitle>
        <DialogDescription>
          {recruiter
            ? "Make changes to the recruiter profile here. Click save when you're done."
            : "Create a new recruiter profile here. Click save when you're done."}
        </DialogDescription>
      </DialogHeader>

      <Form {...formObject}>
        <form
          onSubmit={formObject.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-start gap-2 w-full text-black"
        >
          <InputForm
            control={formObject.control}
            placeholder="Ex: John"
            fieldLabel="Enter First Name:"
            fieldName="firstName"
          />

          <InputForm
            control={formObject.control}
            placeholder="Ex: Doe"
            fieldLabel="Enter Last Name:"
            fieldName="lastName"
          />

          <InputForm
            control={formObject.control}
            placeholder="Ex: john.doe@example.com"
            fieldLabel="Enter Email Address:"
            fieldName="email"
            type="email"
          />

          <InputForm
            control={formObject.control}
            placeholder={
              recruiter
                ? "Leave empty to keep current password"
                : "Enter password"
            }
            fieldLabel="Password:"
            fieldName="password"
            type="password"
          />

          <InputForm
            control={formObject.control}
            placeholder={
              recruiter
                ? "Leave empty to keep current password"
                : "Confirm password"
            }
            fieldLabel="Confirm Password:"
            fieldName="confirmPassword"
            type="password"
          />

          {recruiter && (
            <div className="w-full p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
              <Label className="font-medium">Note:</Label>
              <p>
                Leave password fields empty to keep the current password
                unchanged.
              </p>
            </div>
          )}

          <div className="flex justify-between w-full mt-4">
            <Button
              variant="default"
              className="bg-green-800 hover:bg-green-900"
            >
              {recruiter ? "Update" : "Create"}
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

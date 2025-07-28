import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { X, Plus, MapPin, Building2 } from "lucide-react";
import { createLocation, updateLocation } from "./Fetch";

const schema = yup.object({
  departmentName: yup
    .string()
    .required("Department name is required")
    .min(2, "Department name must be at least 2 characters"),
  sousDepartments: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Sub-department name is required"),
      })
    )
    .min(1, "At least one sub-department is required"),
});

const AddEditLocation = ({ location, onLocationSaved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!location;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      departmentName: "",
      sousDepartments: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sousDepartments",
  });

  useEffect(() => {
    if (isEdit && location) {
      setValue("departmentName", location.departmentName);
      const sousDepartments = location.sousDepartments?.map(name => ({ name })) || [{ name: "" }];
      setValue("sousDepartments", sousDepartments);
    } else {
      reset({
        departmentName: "",
        sousDepartments: [{ name: "" }],
      });
    }
  }, [isEdit, location, setValue, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const locationData = {
        departmentName: data.departmentName.trim(),
        sousDepartments: data.sousDepartments
          .map(dept => dept.name.trim())
          .filter(name => name !== ""),
      };

      const apiCall = isEdit 
        ? updateLocation(location.departmentName, locationData)
        : createLocation(locationData);

        toast.promise(apiCall, {
        loading: isEdit ? "Updating location..." : "Creating location...",
        success: (result) => {
          onLocationSaved(result.location, !isEdit);
          return isEdit ? "Location updated successfully!" : "Location created successfully!";
        },
        error: (error) => {
          return error.message || (isEdit ? "Failed to update location" : "Failed to create location");
        },
      });
    } catch (error) {
      console.error("Error saving location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSubDepartment = () => {
    append({ name: "" });
  };

  const removeSubDepartment = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {isEdit ? (
            <>
              <Building2 className="h-5 w-5 text-blue-600" />
              Edit Location: {location?.departmentName}
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5 text-green-600" />
              Add New Location
            </>
          )}
        </DialogTitle>
      </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Department Name */}
          <div className="space-y-2">
            <Label htmlFor="departmentName" className="text-sm font-medium">
              Department Name *
            </Label>
            <Input
              id="departmentName"
              {...register("departmentName")}
              placeholder="Enter department name"
              className={errors.departmentName ? "border-red-500" : ""}
              disabled={isEdit} // Don't allow editing department name in edit mode
            />
            {errors.departmentName && (
              <p className="text-sm text-red-500">{errors.departmentName.message}</p>
            )}
          </div>

          {/* Sub-departments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Sub-departments *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubDepartment}
                className="flex items-center gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add Sub-department
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      {...register(`sousDepartments.${index}.name`)}
                      placeholder={`Sub-department ${index + 1}`}
                      className={
                        errors.sousDepartments?.[index]?.name ? "border-red-500" : ""
                      }
                    />
                    {errors.sousDepartments?.[index]?.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.sousDepartments[index].name.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubDepartment(index)}
                      className="h-10 w-10 p-0 text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {errors.sousDepartments && typeof errors.sousDepartments.message === 'string' && (
              <p className="text-sm text-red-500">{errors.sousDepartments.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className={isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </div>
              ) : (
                isEdit ? "Update Location" : "Create Location"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
  );
};

export default AddEditLocation;

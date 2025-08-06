import { Popover , PopoverTrigger , PopoverContent} from "../../Components/ui/popover"
import { Button } from "../../Components/ui/button"
import {InputForm , DatePickerForm , SelectForm} from "../../Components/CustomUi/Inputs"
import { JobTypes } from "../../../Data";
import { Form } from "../../Components/ui/form"
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { experienceSchemaValidation } from "../../FormSchemaValidation"

const emptyValue = {
    organizationName: "",
    jobType: "",
    startDate: new Date(),
    endDate: new Date()
}

export default function ExperienceForm({ experience, addApplication, deleteApplication }){
    const formObject = useForm({
        resolver : yupResolver(experienceSchemaValidation),
        defaultValues: (experience ? experience : emptyValue)
    })

    const { handleSubmit, control, reset } = formObject;

    const onSubmit = (data) => {
        if (addApplication) {
            addApplication(data);
        }
        
        // Reset the form if it's not an edit operation (no existing experience)
        if (!experience) {
            reset(emptyValue);
        }
    }

    const handleReset = () => {
        if (experience) {
            // If this is an existing experience, call delete
            if (deleteApplication) deleteApplication();
        } else {
            // Otherwise just reset the form to empty values
            reset(emptyValue);
        }
    }

    return(
        <FormProvider {...formObject}>  
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={ experience ? "secondary" : "default" } size="sm">
                    {experience && experience.organizationName ? experience.organizationName : "+ Add an experience"} 
                </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white p-2 border-0 w-xs md:w-lg lg:w-xl">
                <Form {...formObject}>
                    <form onSubmit={handleSubmit(onSubmit)} onReset={() => handleReset()} className="flex flex-col gap-2 w-full"> 

                        <InputForm control={control} size="w-full" fieldLabel="The Company or organization you worked in :" placeholder="Ex : OCP" fieldName="organizationName" />
                        
                        <SelectForm control={control} fieldLabel="Job Type's :" placeholder="Ex : Internship" fieldName="jobType" selectItems={JobTypes} />
                            
                        <div className="flex justify-between gap-2 flex-col md:flex-row ">
                            <DatePickerForm control={control} fieldName='startDate' fieldLabel="Start Date :" />
                            <DatePickerForm control={control} fieldName='endDate' fieldLabel="End Date :" />
                        </div>

                        <div className="flex justify-between gap-2 flex-col md:flex-row ">
                            <Button type="submit" variant="default">{ experience ? "Update" : "Add"}</Button>
                            <Button type="reset" variant="destructive">{ experience ? "Delete" : "Reset" }</Button>
                        </div>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
        </FormProvider>
    )
}
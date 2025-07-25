import { Popover , PopoverTrigger , PopoverContent} from "../../Components/ui/popover"
import { Button } from "../../Components/ui/button"
import {InputForm , DatePickerForm, SelectForm} from "../../Components/CustomUi/Inputs"
import { Degrees } from "../../../Data";

import { useForm ,FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup" 
import { educationSchemaValidation } from "../../FormSchemaValidation" 
import { Form } from "../../Components/ui/form"



const emptyValue = {
    schoolName : "",
    branch: "",
    titleName : "",
    startDate: new Date(),
    endDate :new Date
}

export default function EducationForm({ education , addApplication , deleteApplication}){

    const formObject = useForm({
        resolver : yupResolver(educationSchemaValidation),
        defaultValues : ( education ? education : emptyValue ) 
    })

    const { handleSubmit, control, reset } = formObject;

    const onSubmit = ( data )=>{
        addApplication(data);
        console.log(data);
        
        // Reset the form if it's not an edit operation
        if (!education) {
            reset(emptyValue);
        }   
    }
    
    const handleReset = () => {
        if (education) {
            if (deleteApplication) deleteApplication();
        } else {
            reset(emptyValue);
        }
    }

    return (
        <FormProvider {...formObject}>
            <Popover>   
                <PopoverTrigger asChild>
                    <Button variant={ education ? "secondary" : "default" } size="sm">
                        {education && education.schoolName ? education.schoolName : "+ Add an Education Phase"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white p-2 border-0 w-xs md:w-lg lg:w-xl">
                    <Form {...formObject}>
                        <form onSubmit={handleSubmit(onSubmit)} onReset={() => handleReset()} className="flex flex-col gap-2 w-full">
                            <InputForm
                                control={control}
                                fieldName="schoolName"
                                fieldLabel="The Pursued School Name:"
                                placeholder="Ex: ENSAM Meknes"
                                size = "w-full"
                            />
                            <InputForm
                                control={control}
                                fieldName="branch"
                                fieldLabel="Branch:"
                                placeholder="Ex: Computer Science, Mechanical Engineering..."
                                size = "w-full"
                            />
                            <SelectForm
                                control={control}
                                fieldName="degree"
                                fieldLabel="Select Degree:"
                                placeholder="Example: Bachelor's"
                                selectItems={Degrees}
                            />
                            <div className="flex flex-col md:flex-row justify-between">
                                <DatePickerForm
                                    control = {control}
                                    fieldLabel = "Start Date"
                                    fieldName = "startDate"
                                />
                                <DatePickerForm
                                    control = {control}
                                    fieldLabel = "End Date"
                                    fieldName = "endDate"
                                />
                            </div>
                            
                            <div className="flex justify-between gap-2 flex-col md:flex-row">
                                <Button type="submit" variant="default">{ education ? "Update" : "Add"}</Button>
                                <Button type="reset" variant="destructive">{ education ? "Delete" :" Reset" }</Button>
                            </div>
                        </form>
                    </Form>
                </PopoverContent>
            </Popover>
        </FormProvider>
    )
}
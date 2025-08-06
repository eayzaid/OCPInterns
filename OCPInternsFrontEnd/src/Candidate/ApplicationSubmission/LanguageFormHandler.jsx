import { Popover , PopoverTrigger , PopoverContent} from "../../Components/ui/popover"
import { Button } from "../../Components/ui/button"
import {InputForm , SelectForm} from "../../Components/CustomUi/Inputs"
import { ProficiencyLanguageLevel } from "../../../Data"
import { Form } from "../../Components/ui/form"
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { languageSchemaValidation } from "../../FormSchemaValidation"

const emptyValue = {
    languageName: "",
    proficiencyLevel: ""
}

export default function LanguageForm({ language, addApplication, deleteApplication }){
    const formObject = useForm({
        resolver : yupResolver(languageSchemaValidation),
        defaultValues: (language ? language : emptyValue)
    })

    const { handleSubmit, control, reset } = formObject;

    const onSubmit = (data) => {
        if (addApplication) {
            addApplication(data);
        }
        
        // Reset the form if it's not an edit operation
        if (!language) {
            reset(emptyValue);
        }
    }
    
    const handleReset = () => {
        if (language) {
            if (deleteApplication) deleteApplication();
        } else {
            reset(emptyValue);
        }
    }

    return(
        <FormProvider {...formObject}>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={ language ? "secondary" : "default" } size="sm">
                    {language && language.languageName ? language.languageName : "+ Add a Language"} 
                </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white p-2 border-0 w-xs md:w-lg lg:w-xl">
                <Form {...formObject}>
                    <form onSubmit={formObject.handleSubmit(onSubmit)} onReset={() => handleReset()} className="flex flex-col gap-2 w-full"> 
                        
                        <InputForm control={control} size="w-full" fieldLabel="Language Name:" placeholder="Ex: French" fieldName="languageName" />
                        
                        <SelectForm control={control} fieldLabel="Proficiency Level:" placeholder="Ex: Intermediate" fieldName="proficiencyLevel" selectItems={ProficiencyLanguageLevel} />
                    
                        <div className="flex justify-between gap-2 flex-col md:flex-row ">
                            <Button type="submit" variant="default">{ language ? "Update" : "Add"}</Button>
                            <Button type="reset" variant="destructive">{ language ? "Delete" : "Reset" }</Button>
                        </div>

                    </form>
                </Form>
            </PopoverContent>
        </Popover>
        </FormProvider>
    )
}
import { Popover , PopoverTrigger , PopoverContent} from "../../Components/ui/popover"
import { Button } from "../../Components/ui/button"
import { InputForm } from "../../Components/CustomUi/Inputs"
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Form } from "../../Components/ui/form"
import { skillSchemaValidation } from "../../FormSchemaValidation"

const emptyValue = {
    skill: ""
}

export default function SkillForm({ skill, addApplication, deleteApplication }){
    const formObject = useForm({
            resolver : yupResolver(skillSchemaValidation),
            defaultValues: (skill ? skill : emptyValue)
        })

    const { handleSubmit, control, reset } = formObject;

    const onSubmit = (data) => {
        if (addApplication) {
            addApplication(data);
        }
        console.log(data);
        
        // Reset the form if it's not an edit operation
        if (!skill) {
            reset(emptyValue);
        }
    }
    
    const handleReset = () => {
        if (skill) {
            if (deleteApplication) deleteApplication();
        } else {
            reset(emptyValue);
        }
    }

    return(
        <FormProvider {...formObject}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={ skill ? "secondary" : "default" } size="sm">
                        {skill && skill.skill ? skill.skill : "+ Add a Skill"} 
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white p-2 border-0 w-xs md:w-lg lg:w-xl">
                    <Form {...formObject}>
                    <form onSubmit={formObject.handleSubmit(onSubmit)} onReset={() => handleReset()} className="flex flex-col gap-2 w-full"> 
                        <InputForm control={control} size="w-full" fieldLabel="Your skill :" placeholder="Ex : C++" fieldName="skill" />
                        <div className="flex justify-between gap-2 flex-col md:flex-row ">
                            <Button type="submit" variant="default">{ skill ? "Update" : "Add"}</Button>
                            <Button type="reset" variant="destructive">{ skill ? "Delete" : "Reset" }</Button>
                        </div>
                    </form>
                    </Form>
                </PopoverContent>
            </Popover>
        </FormProvider>
    )
}
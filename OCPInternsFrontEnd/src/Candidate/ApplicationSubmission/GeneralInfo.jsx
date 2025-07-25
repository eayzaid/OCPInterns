import { Form } from "../../Components/ui/form"
import { useForm } from "react-hook-form"
import { yupResolver} from "@hookform/resolvers/yup"
import { SelectForm } from "../../Components/CustomUi/Inputs"
import { InternshipDurations , InternshipTypesFrancophone , OCPMajorFields } from "../../../Data"
import { GeneralInfoschemaValidation } from "../../FormSchemaValidation"
import { useEffect , useState } from "react"
import { da } from "date-fns/locale/da"

export default function GeneralInfo( { isValid , onAction , setGeneralInfo }){

    const [ load , setLoad ] = useState(false)

    const formObject = useForm({
        resolver : yupResolver(GeneralInfoschemaValidation),
    })

    const onSubmit = ( data ) =>{
        isValid = true;
        console.log(data);
        setGeneralInfo( data )
        setTimeout(()=> isValid = false , 500) //to remove the valid flag after 500ms 
    }

    useEffect(()=>{
        if( !load ){
            setLoad(true);
            return ;
        }
        formObject.handleSubmit(onSubmit)();
    },[onAction])

    return(
        <Form {...formObject}>
            <form  className="flex flex-col gap-4" onSubmit={formObject.handleSubmit(onSubmit)}>
                <SelectForm control={ formObject.control } fieldName="internType" fieldLabel="Internship Type : " 
                placeholder="Stage d'observation" selectItems={InternshipTypesFrancophone} />
                <SelectForm control={ formObject.control } fieldName="internDuration" fieldLabel="Internship Duration : " 
                placeholder="Stage d'observation" selectItems={InternshipDurations} />
                <SelectForm control={ formObject.control } fieldName="internField" fieldLabel="Internship field you wish join  : " 
                placeholder="Geology" selectItems={ OCPMajorFields} />
            </form>
        </Form>
    )
}
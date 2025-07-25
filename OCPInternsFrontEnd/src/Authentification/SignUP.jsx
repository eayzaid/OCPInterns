import { Button } from "../Components/ui/button"
import { InputForm } from "../Components/CustomUi/Inputs"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { SignUpSchemaValidation } from "../FormSchemaValidation"
import { Form } from "../Components/ui/form"
import { useAuth } from "../Hooks"
import { useNavigate } from "react-router"

export default function SignUP ( {setIsLogin} ){
    const { register } = useAuth();
    const navigate = useNavigate();
    const handleIsLogin = () => setIsLogin(true);
    
    const  formObject =  useForm({
        resolver : yupResolver( SignUpSchemaValidation )
    });

    const onSubmit = async (data) =>{
        const { confirmPassword, ...registerData } = data;
        try{
            await register(registerData);
            console.log("let's gooo")
            navigate('/candidate'); //to navigate to the landing page of candidates
        }catch(error){
        }
    }
    
    return(
        <div className="w-9/10 max-w-2xl p-2 rounded-md border-1 border-white bg-gray-800 ">
            <h1 className="font-bigtitle text-3xl text-center text-white">Create an account as <span className="font-bold">Candidate</span></h1>
            <p className= "font-casualfont italic text-center text-gray-500 pb-4">Candidate only service</p>
            <Form {...formObject} >
                <form onSubmit={formObject.handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-2 w-full text-white">
                    <InputForm 
                        control={ formObject.control }
                        placeholder={"Ex : Ayman"}
                        fieldLabel="Enter your First Name : "
                        fieldName="firstName"
                    />
                    <InputForm 
                        control={ formObject.control }
                        placeholder="Exemple : Zaidane"
                        fieldLabel="Enter your Last Name : "
                        fieldName="lastName"
                    />
                    <InputForm 
                        control={ formObject.control }
                        placeholder="Exemple : ayman@example.com"
                        fieldLabel="Enter your Email Address : "
                        fieldName="email"
                    />
                    <InputForm 
                        control={ formObject.control }
                        placeholder="Enter your password"
                        fieldLabel="Enter your Password : "
                        fieldName="password"
                        type="password"
                    />
                    <InputForm 
                        control={ formObject.control }
                        placeholder="Confirm your password"
                        fieldLabel="Confirm your Password : "
                        fieldName="confirmPassword"
                        type="password"
                    />
                    <p onClick={handleIsLogin} className="w-9/10 text-sm italic underline font-casualfont text-gray-300 hover: cursor-pointer">Do you have an Account already ? ( Sign in ) </p>
                    <div className="flex justify-around w-9/10">
                        <Button variant="default">Sign up</Button>
                        <Button type="reset" variant="destructive">Reset</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
} 
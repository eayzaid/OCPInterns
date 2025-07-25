import { Button } from "../Components/ui/button"
import { InputForm } from "../Components/CustomUi/Inputs"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { loginSchemaValidation } from "../FormSchemaValidation"
import { Form } from "../Components/ui/form"
import { useAuth } from "../Hooks"
import {  useNavigate } from "react-router"

export default function Login ( {setIsLogin} ){

    const { login , role } = useAuth();
    const navigate = useNavigate()
    
    const formObject=  useForm({
        resolver : yupResolver( loginSchemaValidation )
    });

    const onSubmit = async (data) =>{
        const redirectURL = await login(data);
        navigate(redirectURL);
    }

    const handleIsSignUp = () => setIsLogin(false); 

    return(
        <div className="w-9/10 max-w-2xl p-2 rounded-md border-1 border-white bg-gray-800 ">
            <h1 className="font-bigtitle text-3xl text-center text-white pb-4">Login to your Account</h1>
            <Form {...formObject}>
                <form  onSubmit={ formObject.handleSubmit(onSubmit) } className="flex flex-col justify-center items-center gap-2 w-full text-white" >
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
                    <a href="l7wa" className="w-9/10 text-sm italic underline font-casualfont text-gray-300 ">Did you forget your password ?</a>
                    <p onClick={ handleIsSignUp } className="w-9/10 text-sm italic underline font-casualfont text-gray-300 hover: cursor-pointer">Create an account ( Candidate Only )</p>
                    <div className="flex justify-around w-9/10">
                        <Button type="submit" variant="default">Login</Button>
                        <Button type="reset" variant="destructive">Reset</Button>
                    </div>
                </form>
            </Form>

        </div>
    )
} 
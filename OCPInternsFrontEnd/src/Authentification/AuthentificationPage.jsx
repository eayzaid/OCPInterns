import SignUP from "../Authentification/SignUP"
import Login from "../Authentification/Login"
import {useState} from "react"
function AuthentificationPage (){
    const [isLogin , setIsLogin] = useState(true);
    return(
        <div className="flex flex-col h-dvh lg:flex-row">
            <div className="h-24 flex items-center justify-center lg:h-dvh lg:flex-1 lg:flex-col lg:items-start lg:gap-7 bg-green-600">
                <h1 className="font-bigtitle text-4xl lg:text-8xl text-white pl-2">OCPInterns</h1>
                <p className="hidden pl-8 font-casualfont text-white text-2xl lg:block"><span className="font-bold">The Official OCP Internship Submission</span><br />Your gateway to innovation, sustainability, and a future shaped by excellence.</p>
            </div>
            <div className="flex-1 flex justify-center items-center w-dvw h-auto bg-gray-900">
                {
                    ( isLogin ? <Login setIsLogin = { () => setIsLogin(false) }/> : <SignUP setIsLogin = { () => setIsLogin(true) }/> )
                }
            </div>
        </div>
    );
}

export default AuthentificationPage ;
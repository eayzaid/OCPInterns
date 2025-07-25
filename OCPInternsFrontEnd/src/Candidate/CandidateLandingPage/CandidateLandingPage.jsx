
import { ApplyNowButton } from "../../Components/ui/button"
import { Link, useSearchParams } from "react-router"
import { checkCanSubmit } from "../ApplicationSubmission/Fetch"
import { useState , useLayoutEffect } from "react"
import { useAuth } from "../../Hooks"

export default function CandidateLandingPage(){

    const [ toURL , setToURL ] = useState("/candidate/apply")
    const { accessToken } = useAuth();

    //this used to determine if the candidate will to apply , or to view his applications
    useLayoutEffect(() => {
        const checkEligibility = async () => {
            const response = await checkCanSubmit(accessToken);
            if (response.status !== 200) {
                setToURL("/candidate/view");
            }
        };
        checkEligibility();
    }, [])


    return(
        <div className="flex-1 flex flex-col justify-center items-center">
            <h1 className="font-bigtitle text-2xl md:text-4xl text-white text-center">
                Contribute to Shaping the Future of Morocco's Industrial Sector with <br/>
            </h1>
            <h1 className="font-bigtitle text-green-600 text-6xl md:text-8xl mt-4">OCP</h1>
            <Link to={toURL} ><ApplyNowButton /></Link>
        </div>
    )
}


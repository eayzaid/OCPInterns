import NavBar from "../Components/NavBar"
import CandidateLandingPage from "./CandidateLandingPage/CandidateLandingPage"
import ApplicationSubmissionPage from "./ApplicationSubmission/ApplicationSubmissionPage"
import ViewApplications from "./ViewApplications/ViewApplications"
import { Route , Routes } from "react-router"

export default function CandidatePage(){
    return(
        <div className="h-screen w-screen flex flex-col">
            <NavBar />
            <Routes>
                <Route index element={<CandidateLandingPage/>}/>
                <Route path="apply" element={<ApplicationSubmissionPage />} />
                <Route path="view" element={<ViewApplications />}/>
            </Routes>  
        </div>
    )
}
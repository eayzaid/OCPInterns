import { useLayoutEffect, useState } from "react";
import ApplicationsTable from "./ApplicationsTable";
import { loadApplications } from "./Fetch"
import { useAuth } from "../../Hooks";

export default function ViewApplications (){
    
    const [applications , setApplications] = useState({});
    const [noApplications , setNoApplications] = useState(true);
    const { accessToken } = useAuth();

    useLayoutEffect(()=>{
        const fetchApplications = async ()=>{
            const response = await loadApplications(accessToken);
            if( response.currentApplication && response.oldApplications ){
                setNoApplications(true);
            }   
            setApplications(response)
            setNoApplications(false)
        }
        fetchApplications();
    } , [ accessToken ])

    return(
        <div className="flex-1 flex flex-col justify-center items-center gap-8">
            <h1 className="font-bigtitle text-white text-4xl lg:text-6xl">View Applications</h1>
            <div className="flex justify-center items-center w-9/10 max-w-8xl">
                { !noApplications && <ApplicationsTable applications={ applications } /> }
            </div>  
        </div>
    )
}
import axios from "axios"
import { apiURL } from "../../Hooks";

async function handleError ( request ){
    try{
        const response = await request();
        return response;
    }catch(error){
        if(error.response) return error.response;
        throw error;
    }
}

export async function getApplicationsCount(){
    return handleError(()=>{
        return axios.get(`${apiURL}/dashboard/applications/count`)
    })
}

export async function getApplicationsStatus(){
    return handleError(()=>{
        return axios.get(`${apiURL}/dashboard/applications/status`)
    })
}

export async function getInternshipsTypes(){
    return handleError(()=>{
        return axios.get(`${apiURL}/dashboard/applications/interntype`)
    })
}

export async function getInternshipsDuration(){
    return handleError(()=>{
        return axios.get(`${apiURL}/dashboard/applications/internduration`)
    })
}

export async function getApplicationsSubmission(){
    return handleError(()=>{
        return axios.get(`${apiURL}/dashboard/applications/submissions`)
    })
}

export async function getApplicationsFields(){
    return handleError(()=>{
        return axios.get(`${apiURL}/dashboard/applications/internfield`)
    })
}

export async function getDepartmentsOverview(){
    return handleError(()=>{
        return axios.get(`${apiURL}/dashboard/locations/mentorship`)
    })
}
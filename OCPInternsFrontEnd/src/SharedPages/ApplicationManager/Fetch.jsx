import axios from "axios"

import { apiURL } from "../../Hooks";

export async function fetchApplications( accessToken , page ){
    try{
        const response = await axios.get(`${apiURL}/application/view?page=${page}&limit=20`,{
            headers:{
                Authorization : accessToken.authorization
            }
        });
        return response.data;
    }catch(error){
        if(error.response) return error.response
        else throw error;
    }
}

export async function fetchApplicationsByFullName( fullName  ){
    try{
        const response = await axios.get(`${apiURL}/application/view?fullName=${fullName}`);
        return response.data;
    }catch(error){
        if(error.response) return error.response
        else throw error;
    }
}

export async function fetchApplication( accessToken , applicationId ){
    try{
        const response = await axios.get(`${apiURL}/application/view/${applicationId}`,{
            headers:{
                Authorization : accessToken.authorization
            }
        });
        return response.data;
    }catch(error){
        if(error.response) return error.response
        else throw error;
    }
}

export async function fetchLocations( accessToken ){
    try{
        const response = await axios.get(`${apiURL}/location/view`,{
            headers:{
                Authorization : accessToken.authorization
            }
        });
        return response.data;
    }catch(error){
        if(error.response) return error.response
        else throw error;
    }
}

export async function updateApplication ( accessToken , applicationId , updatedApplication){
    try{
        const response = await axios.post(`${apiURL}/application/update/${applicationId}`,updatedApplication,{
            headers:{
                Authorization : accessToken.authorization
            }
        });
        return response; // we need to reponse to see the status after , 
    }catch(error){
        if(error.response) return error.response
        else throw error;
    }
}



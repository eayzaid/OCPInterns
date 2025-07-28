import axios from "axios"
import { apiURL } from "./Hooks";

async function handleError ( request ){
    try{
        const response = await request();
        return response;
    }catch(error){
        if(error.response) return error.response;
        throw error;
    }
}

export async function initUser(){
    return handleError(()=>{
        return axios.get(`${apiURL}/user/init`)
    })
}

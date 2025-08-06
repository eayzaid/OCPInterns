import { apiURL , noAuthApi } from "../Hooks"

export const fetchDownload = async (documentID) =>{
    try{
        const response = await noAuthApi.get(`${apiURL}/application/verify/${documentID}`);
        return response
    }catch(error){
        if(error.response)return error.response
        throw error;
    }
} 
import axios from "axios";
import { apiURL } from "../../Hooks";

//used to fetch mentors from locations 
export async function fetchMentors(path) {
  try {
    if (!path) throw new Error("No Path have been selected");
    const response = await axios.get(`${apiURL}/location/view${path}`);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
}

//fetch departmenets names only
export async function fetchDepartments(accessToken) {
  try {
    const response = await axios.get(`${apiURL}/location/view/departments`, {
      headers: {
        Authorization: accessToken.authorization,
      },
    });
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
}

//fetch any user on the platform 
export async function fetchUser(query) {
  try {
    const response = await axios.get(`${apiURL}/user${query}`);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
}

export async function register(userData) {
  try {
    const response = await axios.post(`${apiURL}/user/create/mentor`, userData);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
}

export async function deleteMentor(mentorId) {
  try {
    const response = await axios.delete(`${apiURL}/user/delete/mentor?userId=${mentorId}`);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
}


export async function updateMentor(userData) {
  try {
    const response = await axios.put(`${apiURL}/user/edit/mentor` , userData);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
}
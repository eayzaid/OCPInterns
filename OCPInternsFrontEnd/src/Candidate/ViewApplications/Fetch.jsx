import axios from "axios";
import { apiURL } from "../../Hooks";

export const loadApplications = async (accessToken) => {
  try {
    const response = await axios.get(
      `${apiURL}/application/candidate/view`,
      {
        headers: {
          Authorization: accessToken.authorization,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

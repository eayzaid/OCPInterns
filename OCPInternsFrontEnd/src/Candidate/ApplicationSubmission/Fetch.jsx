import axios from "axios";
import { apiURL } from "../../Hooks";

export const submitApplicaiton = async (accessToken, application) => {
  try {
    const response = await axios.post(
      `${apiURL}/application/candidate/apply`,
      application,
      {
        headers: {
          Authorization: accessToken.authorization,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

export const checkCanSubmit = async (accessToken) => {
  try {
    const response = await axios.get(
      `${apiURL}/application/candidate/eligible`,
      {
        headers: {
          Authorization: accessToken.authorization,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

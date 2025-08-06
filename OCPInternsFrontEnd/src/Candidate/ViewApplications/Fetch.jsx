import axios from "axios";
import { apiURL } from "../../Hooks";

export const loadApplications = async (accessToken) => {
  try {
    const response = await axios.get(`${apiURL}/application/candidate/view`, {
      headers: {
        Authorization: accessToken.authorization,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

export const downloadApplication = async (applicationId) => {
  try {
    const response = await axios.get(
      `${apiURL}/application/candidate/download/${applicationId}`,{
         responseType: 'blob'
      }
    );
    if (response.status !== 200)
      throw new Error("Something went off during the download");
    const blob = new Blob([response.data], {
      type: 'application/pdf',
    });
    const urlBlob  = URL.createObjectURL(blob)
    const tagElement = document.createElement("a");
    tagElement.href = urlBlob;
    tagElement.download = "InternshipLetter.pdf";
    document.body.appendChild(tagElement);
    tagElement.click();
    document.body.removeChild(tagElement);
    URL.revokeObjectURL(urlBlob);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

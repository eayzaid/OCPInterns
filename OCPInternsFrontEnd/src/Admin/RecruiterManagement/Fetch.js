import axios from "axios";
import { apiURL } from "../../Hooks";

// Fetch recruiters with backend filtering using query parameters
export const fetchFilteredRecruiters = async (filterType, filterValue) => {
  try {
    let url = `${apiURL}/user?role=recruiter`;
    
    // Add query parameters for backend filtering
    if (filterValue && filterValue.trim() !== '') {
      if (filterType === "fullName") {
        // Split the full name search into firstName and lastName if possible
        const nameParts = filterValue.trim().split(' ');
        if (nameParts.length === 1) {
          // Search in both first and last name
          url += `&search=${encodeURIComponent(filterValue.trim())}`;
        } else {
          // Try to match firstName and lastName separately
          url += `&firstName=${encodeURIComponent(nameParts[0])}`;
          if (nameParts[1]) {
            url += `&lastName=${encodeURIComponent(nameParts.slice(1).join(' '))}`;
          }
        }
      } else if (filterType === "email") {
        url += `&email=${encodeURIComponent(filterValue.trim())}`;
      }
    }
    
    const response = await axios.get(url);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

// Fetch a specific user (used for editing)
export const fetchUser = async (queryParams = "") => {
  try {
    const response = await axios.get(`${apiURL}/user${queryParams}`);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

// Delete a recruiter
export const deleteRecruiter = async (userId) => {
  try {
    const response = await axios.delete(`${apiURL}/user/delete/recruiter?userId=${userId}`);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

// Create a new recruiter
export const registerRecruiter = async (recruiterData) => {
  try {
    const response = await axios.post(`${apiURL}/user/create/recruiter`, recruiterData);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

// Alias for consistency with mentor management
export const register = registerRecruiter;

// Update an existing recruiter
export const updateRecruiter = async (recruiterData) => {
  try {
    // Prepare the data for update
    const updateData = {
      userId: recruiterData.userId,
      firstName: recruiterData.firstName,
      lastName: recruiterData.lastName,
      email: recruiterData.email,
    };

    const response = await axios.put(`${apiURL}/user/edit/recruiter`, updateData);
    return response;
  } catch (error) {
    if (error.response) return error.response;
    throw error;
  }
};

import axios from "axios";

import { apiURL } from "../../Hooks";

// Get all locations with optional filtering
export const getFilteredLocations = async (departmentName, subDepartment) => {
  try {
    const url = `${apiURL}/location?${
      departmentName ? `departmentName=${departmentName}` : ""
    }${subDepartment ? `subDepartment=${subDepartment}` : ""}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch locations" };
  }
};

// Get location by department name
export const getLocationByDepartment = async (departmentName) => {
  try {
    const response = await axios.get(`${apiURL}/location/${departmentName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch location" };
  }
};

// Create new location
export const createLocation = async (locationData) => {
  try {
    const response = await axios.post(
      `${apiURL}/location/create`,
      locationData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create location" };
  }
};

// Update location
export const updateLocation = async (departmentName, updateData) => {
  try {
    const response = await axios.put(
      `${apiURL}/location/${departmentName}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update location" };
  }
};

// Delete location
export const deleteLocation = async (departmentName) => {
  try {
    const response = await axios.delete(`${apiURL}/location/${departmentName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete location" };
  }
};

import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./App";

/*
    useAuth function is used to provide AccessToken when needed and make request to refresh both the refersh and Access Token
*/
export const apiURL = import.meta.env.VITE_BACK_END_API_URL;
const expireAccessTokenTime = 10 * 60; //10 min

//use different instance for authApi to avoid authentificaiton request from being sent with the headers
const authApi = axios.create({
  baseURL: `${apiURL}/user/`,
  timeout: 1000,
  withCredentials: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const loginHandler = async (userData) => {
  const response = await authApi.post("auth", userData, {
    headers: {
      "Content-Type": "Application/json",
    },
    withCredentials: true,
  });
  if (response.status === 200)
    return response.data; //data { Autorizaiton : ......}
  else throw new Error(response.data.error);
};

const registerHandler = async (userData, userRole) => {
  /*
    userRole can be candidate , admin , recruiter , mentor 
  */
  const response = await authApi.post(`create/${userRole}`, userData, {
    headers: {
      "Content-Type": "Application/json",
    },
    withCredentials: true,
  });
  if (response.status === 200)
    return response.data; //data { Autorizaiton : ...... , firstName :  , lastName }
  else throw new Error(response.data.error);
};

//the new refershToken will automaticly get handed to the cookie of the http
const getAccessToken = async () => {
  const response = await authApi.get("refresh", {
    withCredentials: true,
  });
  if (response.status === 200)
    return response.data; //data { Autorizaiton : ......}
  else throw new Error(response.data.error);
};

const logoutHandler = async () => {
  const response = await authApi.get("logout", {
    withCredentials: true, //we use refresh token to validate our logout
  });
  if (response.status === 200) return true; //data { Autorizaiton : ......}
  else throw new Error(response.data.error);
};

//the wrapper around the application , give the context to acces any of the authentification information
export function AuthProvider({ context, children }) {
  const [accessToken, setAccessToken] = useState({
    authorization: "",
  });
  const [fullName, setFullName] = useState("");
  let intervalId = null;
  let isRefreshing = false;

  //intercept request going without authorization headers
  axios.interceptors.request.use(
    async (config) => {
      // Only set Authorization header if accessToken.authorization exists and is not empty
      if (!config.headers.Authorization) {
        //if the in-memory token is not empty
        if (accessToken.authorization) {
          config.headers.Authorization = accessToken.authorization;
        }

        //acces token to be fetched
        else if (!isRefreshing) {
          clearInterval(intervalId);
          isRefreshing = true;
          const newAccessToken = await getAccessToken();
          isRefreshing = false;
          //this responsable for refreshing the token every 10
          intervalId = setInterval(async () => {
            const newAccessToken = await getAccessToken();
            setAccessToken(newAccessToken);
          }, expireAccessTokenTime * 1000);

          setAccessToken(newAccessToken);
          config.headers.Authorization = newAccessToken.authorization;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const login = async (userData) => {
    try {
      const { authorization, redirect, firstName, lastName } =
        await loginHandler(userData);
      setAccessToken({ authorization });
      setFullName(firstName + " " + lastName);
      return redirect;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const accessToken = await registerHandler(userData, "candidate");
      setAccessToken(accessToken);
      setFullName(firstName + " " + lastName);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutHandler();
      setAccessToken(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    accessToken,
    fullName,
    login,
    register,
    logout,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
}

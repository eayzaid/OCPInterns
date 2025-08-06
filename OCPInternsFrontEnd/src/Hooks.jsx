import axios from "axios";
import { useState, useContext, useLayoutEffect, useEffect } from "react";
import { AuthContext } from "./App";
import { Outlet, Navigate } from "react-router-dom";
/*
    useAuth function is used to provide AccessToken when needed and make request to refresh both the refersh and Access Token
*/
export const apiURL = import.meta.env.VITE_BACK_END_API_URL;
const expireAccessTokenTime = 10 * 60; //10 min

export const noAuthApi = axios.create(
  {
    timeout : 1000,
  }
)

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
  const [role, setRole] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Add loading state
  let intervalId = null;
  let isRefreshing = false;

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get access token from refresh token
        const newAccessToken = await getAccessToken();
        const { authorization, role } = newAccessToken;
        setAccessToken({ authorization });
        setRole(role);
        
        // Set up automatic token refresh
        intervalId = setInterval(async () => {
          try {
            const newAccessToken = await getAccessToken();
            const { authorization, role } = newAccessToken;
            setRole(role);
            setAccessToken({ authorization });
          } catch (error) {
            // If refresh fails, clear auth state
            setRole(null);
            setAccessToken(null);
            clearInterval(intervalId);
          }
        }, expireAccessTokenTime * 1000);
        
      } catch (error) {
        // No valid refresh token, user is not authenticated
        setRole(null);
        setAccessToken(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();

    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

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
          try {
            const newAccessToken = await getAccessToken();
            const { authorization, role } = newAccessToken;
            isRefreshing = false;
            setIsAuthChecking(false); // Auth check complete
            
            //this responsable for refreshing the token every 10
            intervalId = setInterval(async () => {
              const newAccessToken = await getAccessToken();
              const { authorization, role } = newAccessToken;
              setRole(role);
              setAccessToken(authorization);
            }, expireAccessTokenTime * 1000);

            setAccessToken(authorization);
            setRole(role);
            config.headers.Authorization = newAccessToken.authorization;
          } catch (error) {
            // If token refresh fails, user is not authenticated
            isRefreshing = false;
            setIsAuthChecking(false);
            setRole(null);
            setAccessToken(null);
            throw error;
          }
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const login = async (userData) => {
    try {
      const { authorization, redirect, firstName, lastName, role } =
        await loginHandler(userData);
      setAccessToken({ authorization });
      setFullName(firstName + " " + lastName);
      setRole(role);
      setIsAuthChecking(false); // Auth check complete
      return redirect;
    } catch (error) {
      setIsAuthChecking(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { authorization, firstName, lastName, role } =
        await registerHandler(userData, "candidate");
      setAccessToken(authorization);
      setFullName(firstName + " " + lastName);
      setRole(role);
      setIsAuthChecking(false); // Auth check complete
    } catch (error) {
      setIsAuthChecking(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutHandler();
      setAccessToken(null);
      setRole("");
      setIsAuthChecking(false);
    } catch (error) {
      setIsAuthChecking(false);
      throw error;
    }
  };

  const value = {
    role,
    accessToken,
    fullName,
    isAuthChecking, // Expose loading state
    login,
    register,
    logout,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
}

export const RequireAuth = ({ requiredRole }) => {
  const { role, isAuthChecking } = useAuth();
  
  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return role === requiredRole ? <Outlet /> : <Navigate to="/auth" replace />;
};

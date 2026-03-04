import axios, { AxiosError, AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const axiosInstanceFormData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const axiosInstanceNoAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const RequestInterceptor = (config: any) => {
  // Try to get token from localStorage
  let token = localStorage.getItem("auth");
  
  // Debug: log the token attempt
  if (!token) {
    console.warn("[Axios] No token found in localStorage");
  } else {
    console.log("[Axios] Token found, adding to Authorization header");
  }
  
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  console.log("[Axios Request] Headers:", config.headers);
  return config;
}

const RequestErrorInterceptor = (error: AxiosError) => {
  return Promise.reject(error);
}

const ResponseInterceptor = (response: any) => {
  return response;
}

const ResponseErrorInterceptor = (error: AxiosError) => {
  // Handle 401 Unauthorized - clear token and redirect to login
  if (error.response?.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
      window.location.href = "/signin";
    }
  }
  return Promise.reject(error);
}

// Apply interceptors to axiosInstance (with auth)
axiosInstance.interceptors.request.use(RequestInterceptor, RequestErrorInterceptor);
axiosInstance.interceptors.response.use(ResponseInterceptor, ResponseErrorInterceptor);

// Apply interceptors to axiosInstanceFormData (with auth)
axiosInstanceFormData.interceptors.request.use(RequestInterceptor, RequestErrorInterceptor);
axiosInstanceFormData.interceptors.response.use(ResponseInterceptor, ResponseErrorInterceptor);

// axiosInstanceNoAuth doesn't need the auth interceptor

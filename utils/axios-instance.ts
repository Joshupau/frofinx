import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

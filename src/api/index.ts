/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";

export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

interface ResponseData {
  success: boolean;
  message?: string;
  data?: any;
}

// const getToken = () => () => {
//   return localStorage.getItem("authToken");
// };

export const axiosFetch = async (
  ACTION: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  allowedHeader: boolean = true,
  payload?: unknown
): Promise<AxiosResponse<ResponseData> | null> => {
  const authToken = localStorage.getItem("authToken");
  const token = allowedHeader ? authToken : null;
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
  try {
    switch (ACTION) {
      case "GET":
        return axios.get(`${BASE_URL}${url}`, { headers });
      case "POST":
        return axios.post(`${BASE_URL}${url}`, payload || {}, { headers });
      case "PUT":
        return axios.put(`${BASE_URL}${url}`, payload || {}, { headers });
      case "PATCH":
        return axios.patch(`${BASE_URL}${url}`, payload || {}, { headers });
      case "DELETE":
        return axios.delete(`${BASE_URL}${url}`, { headers });
      default:
        return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

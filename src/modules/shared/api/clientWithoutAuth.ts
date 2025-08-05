import axios, { isAxiosError } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const clientWithoutAuth = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response && Boolean(error.request);
}

clientWithoutAuth.interceptors.response.use(
  async (res) => {
    console.log("response", res.data);
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("requestURL", originalRequest);
    console.log("requestHeaders", originalRequest.headers.Authorization);
    console.log("requestBody", originalRequest.data);
    console.log("errorResponse", error.response?.data);
    

    if (isAxiosError(error) && isNetworkError(error)) {
      setTimeout(() => Promise.reject(error), 200);
    } else {
      return Promise.reject(error);
    }
  },
);
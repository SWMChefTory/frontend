import axios, { isAxiosError } from "axios";
import {
  findAccessToken,
  findRefreshToken,
  removeAuthToken,
  storeAccessToken,
  storeRefreshToken,
} from "@/src/modules/shared/context/auth/storage/SecureStorage";
import { refreshUser } from "@/src/modules/shared/context/auth/api";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export async function refreshToken() {
  try {
    const refreshToken = findRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await refreshUser(refreshToken);
    await storeAccessToken(response.access_token);
    await storeRefreshToken(response.refresh_token);
    return response.access_token;
  } catch (error) {
    await removeAuthToken();
    throw error;
  }
}

function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response && Boolean(error.request);
}

client.interceptors.request.use(
  async (config) => {    
    if (config.skipAuth) {
      return config;
    }

    try {
      const token = findAccessToken();
      if (token) {
        config.headers.Authorization = `${token}`;
        return config;
      } else {
        throw new Error("No access token available");
      }
    } catch (error) {
      console.error("토큰 가져오기 실패:", error);
      throw error;
    }
  },
  (error) => {
    console.log("__3__");
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  async (res) => {
    console.log("response", res.data);
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("requestHeaders", originalRequest.headers.Authorization);
    console.log("requestBody", originalRequest.data);
    console.log("errorResponse", error.response?.data);

    if (
      isAxiosError(error) &&
      error.response?.data?.errorCode?.startsWith("AUTH") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `${newToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (isAxiosError(error) && isNetworkError(error)) {
      setTimeout(() => Promise.reject(error), 200);
    } else {
      return Promise.reject(error);
    }
  },
);

export { client };

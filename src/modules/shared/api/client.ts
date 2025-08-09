import axios, { isAxiosError } from "axios";
import {
  findAccessToken,
  findRefreshToken,
  removeAuthToken,
  storeAccessToken,
  storeRefreshToken,
} from "@/src/modules/shared/storage/SecureStorage";
import { reissueRefreshToken } from "@/src/modules/shared/api/apiWithoutAuth";
import { useUserStore } from "@/src/modules/user/business/store/userStore";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

//todo 유저 상태 값 갱신해줘야 할듯. 에러 발생 시 토큰을 지우면 로그인 상태가 아닌데, 유저값이 갱신되지 않음.
export async function refreshToken() {
  try {
    const refreshToken = findRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await reissueRefreshToken(refreshToken);
    await storeAccessToken(response.access_token);
    await storeRefreshToken(response.refresh_token);
    return response.access_token;
  } catch (error) {
    await removeAuthToken();
    useUserStore.getState().setUser(null);

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
    return Promise.reject(error);
  },
);

//응답을 받았을 때, access token이 만료되었을 때의 오류라면 refresh token으로 다시 발급 받거나, 발급에 실패하면 로그 아웃 상태로 바꾼다.
client.interceptors.response.use(
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

    if (originalRequest.skipAuth) {
      return Promise.reject(error);
    }

    if (
      isAxiosError(error) &&
      //todo : accesstoken가 만료되었을 때만? 혹은 유효하지 않은 것까지?
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

import axios, { isAxiosError } from "axios";
import {
  findAccessToken,
  findRefreshToken,
  removeAuthToken,
  storeAccessToken,
  storeRefreshToken,
} from "@/src/modules/shared/storage/SecureStorage";
import { reissueRefreshToken } from "@/src/modules/shared/api/refresh/reissueApi";
// import 

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// 토큰 갱신 공유 자원 - 중복 호출 방지
class TokenRefreshManager {
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing = false;


  //토큰 재발급
  async refreshToken(): Promise<string> {
    // 이미 갱신 중이면 기존 Promise 반환
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.executeRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      // 갱신 완료 후 상태 초기화
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async executeRefresh(): Promise<string> {
    try {
      const refreshToken = findRefreshToken();
      console.log("token을 갱신하기 위해 refreshToken을 가져옵니다.", refreshToken);
      if (!refreshToken) {
        throw new Error("No refresh token");
      };

      const response = await reissueRefreshToken(refreshToken);
      await storeAccessToken(response.access_token);
      await storeRefreshToken(response.refresh_token);
      return response.access_token;
    } catch (error) {
      await removeAuthToken();
      throw error;
    } 
  }
}

const tokenRefreshManager = new TokenRefreshManager();

function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response && Boolean(error.request);
} 

client.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) {
      return config;
    }
    const token = findAccessToken();
    if (!token) {
      return config;
    }
    config.headers.Authorization = `${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  async (res) => {
    console.log(res);
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.skipAuth) {
      return Promise.reject(error);
    }

    if (
      isAxiosError(error) &&
      error.response?.data?.errorCode?.startsWith("AUTH") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 공유 자원을 통해 토큰 갱신 - 중복 호출 방지
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

export const refreshToken = () => tokenRefreshManager.refreshToken();

export { client };
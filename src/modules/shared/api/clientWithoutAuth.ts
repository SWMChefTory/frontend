import axios, { isAxiosError } from "axios";
import {
  findAccessToken,
  findRefreshToken,
  removeAuthToken,
  storeAccessToken,
  storeRefreshToken,
} from "@/src/modules/shared/utils/auth/storage/SecureStorage";
import { refreshUser } from "@/src/modules/shared/context/auth/api";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const clientWithoutAuth = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

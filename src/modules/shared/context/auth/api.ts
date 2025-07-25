import { client } from "@/src/modules/shared/api/api";
import { LoginInfo, SignupData } from "../../types/auth";

export interface AuthorizationTokenResponse {
  access_token: string;
  refresh_token: string;
  user_info: UserResponse;
}

export interface UserResponse {
  email: string;
  nickname: string;
}

export interface LoginRequest {
  id_token: string;
  provider: string;
}

export interface SignupRequest {
  id_token: string;
  provider: string;
  nickname: string;
  gender: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface DeleteAccountRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export async function loginUser(
  loginInfo: LoginInfo,
): Promise<AuthorizationTokenResponse> {
  const loginRequest: LoginRequest = {
    id_token: loginInfo.id_token,
    provider: loginInfo.provider,
  };
  const response = await client.post(
    "/account/login/oauth", 
    loginRequest,
    { skipAuth: true },
  );
  return response.data;
}

export async function signupUser(
  signupData: SignupData,
): Promise<AuthorizationTokenResponse> {
  const signupRequest: SignupRequest = {
    id_token: signupData.id_token,
    provider: signupData.provider,
    nickname: signupData.nickname,
    gender: signupData.gender,
  };
  const response = await client.post("/account/signup/oauth", signupRequest, {
    skipAuth: true,
  });
  return response.data;
}

export async function deleteAccount(refreshToken: string): Promise<void> {
  const deleteAccountRequest: DeleteAccountRequest = {
    refresh_token: refreshToken,
  };
  const response = await client.post(
    "/account/delete",
    deleteAccountRequest,
    { skipAuth: true },
  );
  return response.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const logoutRequest: LogoutRequest = {
    refresh_token: refreshToken,
  };
  return await client.post(
    "/auth/logout",
    logoutRequest,
    { skipAuth: true },
  );
}

export async function refreshUser(
  refreshToken: string,
): Promise<AuthorizationTokenResponse> {
  const refreshTokenRequest: RefreshTokenRequest = {
    refresh_token: refreshToken,
  };
  const response = await client.post(
    "/auth/token/reissue",
    refreshTokenRequest,
    { skipAuth: true },
  );
  return response.data;
}

export async function getUser(): Promise<UserResponse> {
  const response = await client.get("/user/me");
  return response.data;
}
import { clientWithoutAuth } from "@/src/modules/shared/api/clientWithoutAuth";
import { LoginInfo, SignupData } from "@/src/modules/shared/types/auth"
import { UTCDateAtMidnight } from "@/src/modules/shared/utils/UTCDateAtMidnight";

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
  date_of_birth: UTCDateAtMidnight;
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
  console.log("loginRequest", loginRequest);
  const response = await clientWithoutAuth.post(
    "/account/login/oauth", 
    loginRequest,
  );
  return response.data;
}

export async function signupUser(
  signupData: SignupData,
): Promise<AuthorizationTokenResponse> {
  console.log("signupData", signupData);
  const signupRequest: SignupRequest = {
    id_token: signupData.id_token,
    provider: signupData.provider,
    nickname: signupData.nickname,
    gender: signupData.gender,
    date_of_birth: signupData.date_of_birth,
  };
  console.log("signupRequest", signupRequest);
  const response = await clientWithoutAuth.post(
    "/account/signup/oauth",
     signupRequest,
    );
  return response.data;
}

export async function deleteAccount(refreshToken: string): Promise<void> {
  const deleteAccountRequest: DeleteAccountRequest = {
    refresh_token: refreshToken,
  };
  const response = await clientWithoutAuth.post(
    "/account/delete",
    deleteAccountRequest,
  );
  return response.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const logoutRequest: LogoutRequest = {
    refresh_token: refreshToken,
  };
  const response = await clientWithoutAuth.post(
    "/account/logout",
    logoutRequest,
  );
  return response.data;
}

export async function reissueRefreshToken(
  refreshToken: string,
): Promise<AuthorizationTokenResponse> {
  const refreshTokenRequest: RefreshTokenRequest = {
    refresh_token: refreshToken,
  };
  const response = await clientWithoutAuth.post(
    "/auth/token/reissue",
    refreshTokenRequest,
  );
  return response.data;
}
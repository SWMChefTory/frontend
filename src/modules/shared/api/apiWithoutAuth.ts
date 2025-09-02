import { clientWithoutAuth } from "@/src/modules/shared/api/clientWithoutAuth";
import { LoginInfo, SignupData } from "@/src/modules/shared/types/auth";
import { UTCDateAtMidnight } from "@/src/modules/shared/utils/UTCDateAtMidnight";
import { Gender } from "@/src/modules/user/enums/Gender";

export interface AuthorizationTokenResponse {
  access_token: string;
  refresh_token: string;
  user_info: UserResponse;
}

export interface UserResponse {
  gender: Gender;
  nickname: string;
  date_of_birth: string;
  is_marketing_agreed: boolean;
  is_privacy_agreed: boolean;
  is_terms_of_use_agreed: boolean;
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
  is_marketing_agreed: boolean;
  is_privacy_agreed: boolean;
  is_terms_of_use_agreed: boolean;
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
    is_marketing_agreed: signupData.is_marketing_agreed,
    is_privacy_agreed: signupData.is_privacy_agreed,
    is_terms_of_use_agreed: signupData.is_terms_of_use_agreed,
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
  const response = await clientWithoutAuth.delete(
    "/account",
    {
      data : deleteAccountRequest
    }
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

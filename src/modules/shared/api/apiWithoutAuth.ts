import { clientWithoutAuth } from "@/src/modules/shared/api/clientWithoutAuth";
import { LoginInfo, SignupData } from "@/src/modules/shared/types/auth";
import { Gender } from "@/src/modules/user/enums/Gender";
import { DateOnly } from "../utils/dateOnly";

export interface AuthorizationTokenResponse {
  access_token: string;
  refresh_token: string;
  user_info: UserResponse;
}

export interface RawAuthorizationTokenResponse {
  access_token: string;
  refresh_token: string;
  user_info: RawUserResponse;
}

interface RawUserResponse {
  provider_sub: string;
  gender: Gender | null;
  nickname: string;
  date_of_birth: string | null;
  terms_of_use_agreed_at: DateOnly | null;
  privacy_agreed_at: DateOnly | null;
  marketing_agreed_at: DateOnly | null;
}

function fromRaw(
  rawAuthorizationTokenResponse: RawAuthorizationTokenResponse,
): AuthorizationTokenResponse {
  return {
    access_token: rawAuthorizationTokenResponse.access_token,
    refresh_token: rawAuthorizationTokenResponse.refresh_token,
    user_info: convertRawUserResponseToUserResponse(
      rawAuthorizationTokenResponse.user_info,
    ),
  };
}

function convertRawUserResponseToUserResponse(
  rawUserResponse: RawUserResponse,
): UserResponse {
  return {
    provider_sub: rawUserResponse.provider_sub,
    gender: rawUserResponse.gender,
    nickname: rawUserResponse.nickname,
    date_of_birth: rawUserResponse.date_of_birth,
    is_marketing_agreed: rawUserResponse.marketing_agreed_at ? true : false,
    is_privacy_agreed: rawUserResponse.privacy_agreed_at ? true : false,
    is_terms_of_use_agreed: rawUserResponse.terms_of_use_agreed_at
      ? true
      : false,
  };
}

export interface UserResponse {
  provider_sub: string;
  gender: Gender | null;
  nickname: string;
  date_of_birth: string | null;
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
  gender: Gender | null;
  date_of_birth: DateOnly | null;
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
  const response = await clientWithoutAuth.post(
    "/account/login/oauth",
    loginRequest,
  );
  return fromRaw(response.data);
}

export async function signupUser(
  signupData: SignupData,
): Promise<AuthorizationTokenResponse> {
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
  if (!signupData.is_privacy_agreed || !signupData.is_terms_of_use_agreed) {
    throw new Error("Privacy and terms of use must be agreed");
  }
  const response = await clientWithoutAuth.post(
    "/account/signup/oauth",
    signupRequest,
  );

  return fromRaw(response.data);
}

export async function deleteAccount(refreshToken: string): Promise<void> {
  const deleteAccountRequest: DeleteAccountRequest = {
    refresh_token: refreshToken,
  };
  const response = await clientWithoutAuth.delete("/account", {
    data: deleteAccountRequest,
  });
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

import { AuthorizationTokenResponse } from "@/src/modules/shared/api/apiWithoutAuth";
import { client } from "@/src/modules/shared/api/client";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { Gender } from "@/src/modules/user/enums/Gender";

export interface UserResponse {
  gender: Gender | null;
  is_marketing_agreed: boolean;
  is_privacy_agreed: boolean;
  is_terms_of_use_agreed: boolean;
  nickname: string;
  date_of_birth: DateOnly | null;
}

export interface UserRequest {
  gender: Gender | null;
  is_marketing_agreed: boolean;
  is_privacy_agreed: boolean;
  is_terms_of_use_agreed: boolean;
  nickname: string;
  date_of_birth: DateOnly | null;
}


interface RawUserResponse {
  gender: Gender | null;
  marketing_agreed_at: DateOnly | null;
  privacy_agreed_at: DateOnly | null;
  terms_of_use_agreed_at: DateOnly | null;
  nickname: string;
  date_of_birth: string | null;
}


function convertResponseFormat(rawUserResponse: RawUserResponse): UserResponse {
  return {
    gender: rawUserResponse.gender,
    nickname: rawUserResponse.nickname,
    date_of_birth: rawUserResponse.date_of_birth? DateOnly.create(rawUserResponse.date_of_birth) : null,
    is_marketing_agreed: rawUserResponse.marketing_agreed_at ? true : false,
    is_privacy_agreed: rawUserResponse.privacy_agreed_at ? true : false,
    is_terms_of_use_agreed: rawUserResponse.terms_of_use_agreed_at ? true : false,
  };
}

export const getUser: () => Promise<UserResponse> = async () => {
  const response = await client.get("/users/me");
  console.log("response", response.data);
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
  return convertResponseFormat(response.data);
};



export const patchUser : (user: UserRequest) => Promise<UserResponse> = async (user: UserRequest) => {
  const response = await client.patch("/users/me", user);
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
  return convertResponseFormat(response.data);
};

export const changeUserNickname = async (name: string) => {
  const response = await client.patch("/users/me", { nickname: name });
  if (!response.data) { 
    throw new Error("응답에 body가 없습니다.");
  }
};

export const changeUserDateOfBirth = async (dateOfBirth: string|null) => {
  console.log("dateOfBirth", dateOfBirth);
  const response = await client.patch("/users/me", {
    date_of_birth: dateOfBirth,
  });
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
};

export const changeUserGender = async (gender: Gender|null) => {
  const response = await client.patch("/users/me", { gender: gender });
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
};

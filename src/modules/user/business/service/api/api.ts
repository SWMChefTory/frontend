import { AuthorizationTokenResponse } from "@/src/modules/shared/api/apiWithoutAuth";
import { client } from "@/src/modules/shared/api/client";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import { Gender } from "@/src/modules/user/enums/Gender";

export interface UserGetResponse {
  gender: Gender | null;
  is_marketing_agreed: boolean;
  is_privacy_agreed: boolean;
  is_terms_of_use_agreed: boolean;
  nickname: string;
  date_of_birth: string | null;
}

interface RawUserGetResponse {
  gender: Gender | null;
  marketing_agreed_at: DateOnly | null;
  privacy_agreed_at: DateOnly | null;
  terms_of_use_agreed_at: DateOnly | null;
  nickname: string;
  date_of_birth: string | null;
}


function convertRawUserResponseToUserResponse(rawUserResponse: RawUserGetResponse): UserGetResponse {
  return {
    gender: rawUserResponse.gender,
    nickname: rawUserResponse.nickname,
    date_of_birth: rawUserResponse.date_of_birth,
    is_marketing_agreed: rawUserResponse.marketing_agreed_at ? true : false,
    is_privacy_agreed: rawUserResponse.privacy_agreed_at ? true : false,
    is_terms_of_use_agreed: rawUserResponse.terms_of_use_agreed_at ? true : false,
  };
}
export const getUser: () => Promise<UserGetResponse> = async () => {
  const response = await client.get("/users/me");
  console.log("response", response.data);
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
  return convertRawUserResponseToUserResponse(response.data);
};

export const changeUserNickname = async (name: string) => {
  const response = await client.put("/users/me/nickname", { nickname: name });
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
};

export const changeUserDateOfBirth = async (dateOfBirth: string) => {
  const response = await client.put("/users/me/date-of-birth", {
    date_of_birth: dateOfBirth,
  });
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
};

export const changeUserGender = async (gender: Gender) => {
  const response = await client.put("/users/me/gender", { gender: gender });
  if (!response.data) {
    throw new Error("응답에 body가 없습니다.");
  }
};

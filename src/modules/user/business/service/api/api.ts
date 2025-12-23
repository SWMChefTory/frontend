import { client } from "@/src/modules/shared/api/client";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { Gender } from "@/src/modules/user/enums/Gender";

export interface UserResponse {
  provider_sub: string;
  gender: Gender | null;
  is_marketing_agreed: boolean;
  is_privacy_agreed: boolean;
  is_terms_of_use_agreed: boolean;
  nickname: string;
  date_of_birth: DateOnly | null;
}

interface RawUserResponse {
  provider_sub: string;
  gender: Gender | null;
  marketing_agreed_at: DateOnly | null;
  privacy_agreed_at: DateOnly | null;
  terms_of_use_agreed_at: DateOnly | null;
  nickname: string;
  date_of_birth: string | null;
}

function convertResponseFormat(rawUserResponse: RawUserResponse): UserResponse {
  return {
    provider_sub: rawUserResponse.provider_sub,
    gender: rawUserResponse.gender,
    nickname: rawUserResponse.nickname,
    date_of_birth: rawUserResponse.date_of_birth
      ? DateOnly.create(rawUserResponse.date_of_birth)
      : null,
    is_marketing_agreed: !!rawUserResponse.marketing_agreed_at,
    is_privacy_agreed: !!rawUserResponse.privacy_agreed_at,
    is_terms_of_use_agreed: !!rawUserResponse.terms_of_use_agreed_at,
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

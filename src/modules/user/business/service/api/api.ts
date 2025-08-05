import { client } from "@/src/modules/shared/api/client";
import { Gender } from "@/src/modules/user/enums/Gender";

export interface UserGetResponse {
  gender: Gender;
  nickname: string;
  date_of_birth: string; // ISO 형식 문자열
}
export const getUser : () => Promise<UserGetResponse> = async () =>  {
  const response = await client.get("/users/me");
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
  return response.data;
};

export const changeUserNickname = async (name: string) => {
  const response = await client.put("/users/me/nickname", {nickname: name});
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
};

export const changeUserDateOfBirth = async (dateOfBirth: string) => {
  const response = await client.put("/users/me/date-of-birth", {date_of_birth: dateOfBirth});
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
};

export const changeUserGender = async (gender: Gender) => {
  const response = await client.put("/users/me/gender", {gender: gender});
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
};
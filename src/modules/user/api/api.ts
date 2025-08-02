import { client } from "@/src/modules/shared/api/client";
import { UTCDateAtMidnight } from "@/src/modules/shared/utils/UTCDateAtMidnight";

export const getUser : ()=>Promise<User> = async () => {
  const response = await client.get("/users/me");
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
  return response.data;
};

export const changeUserNickname : (name: string)=>void = async (name: string) => {
  const response = await client.put("/users/me/nickname", {nickname: name});
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
  // return response.data;
};

export const changeUserDateOfBirth : (dateOfBirth: UTCDateAtMidnight)=>void = async (dateOfBirth: UTCDateAtMidnight) => {
  const response = await client.put("/users/me/date-of-birth", {date_of_birth: dateOfBirth});
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
  // return response.data;
};
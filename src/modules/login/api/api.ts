import { client } from "@/src/modules/shared/api/client";

export const getUser : ()=>Promise<User | null> = async () => {
  const response = await client.get("/user/me");
  if(!response.data){
    throw new Error("응답에 body가 없습니다.");
  }
  return response.data;
};
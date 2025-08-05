import { userSchema } from "./userScheme";

export function validateNickname(nickname: string) {
  const result = userSchema.pick({ nickname: true }).safeParse({ nickname });

  if (result.success) {
    return { isValid: true, message: "" };
  } else {
    // safeParse의 error는 타입이 확실함
    return { isValid: false, message: result.error.message };
  }
}

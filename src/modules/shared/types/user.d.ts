// user.d.ts
import { UTCDateAtMidnight } from "../utils/UTCDateAtMidnight";

declare global {
  interface User {
    email: string;
    nickname: string;
    dateOfBirth: UTCDateAtMidnight;
  }
}

export {}; // 모듈로 만들기 위한 빈 export

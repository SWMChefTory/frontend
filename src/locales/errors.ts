import type { Market } from "@/src/modules/shared/types/market";

const ERROR_MESSAGES = {
  KOREA: {
    error: "오류",
    loginFailed: "로그인에 실패했습니다.",
    googleError: "구글에 문제가 생겼습니다.",
    serverError: "서버에 문제가 있습니다.",
    appleUnavailable: "이 기기에서는 Apple 로그인을 사용할 수 없습니다.",
    appleLoginFailed: "Apple 로그인에 실패했습니다.",
    googleLoginFailed: "Google 로그인에 실패했습니다.",
    loggedOut: "로그아웃 되었습니다.",
  },
  GLOBAL: {
    error: "Error",
    loginFailed: "Login failed.",
    googleError: "Google sign-in error occurred.",
    serverError: "Server error occurred.",
    appleUnavailable: "Apple Sign-In is not available on this device.",
    appleLoginFailed: "Apple Sign-In failed.",
    googleLoginFailed: "Google Sign-In failed.",
    loggedOut: "You have been logged out.",
  },
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES.KOREA;

export const getErrorMessage = (
  market: Market | null,
  key: ErrorMessageKey,
): string => {
  const currentMarket = market === "GLOBAL" ? "GLOBAL" : "KOREA";
  return ERROR_MESSAGES[currentMarket][key];
};

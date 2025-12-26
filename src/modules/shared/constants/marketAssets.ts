import type { Market } from "../types/market";

/**
 * Market별 로고 이미지 경로 관리
 *
 * 이미지 경로 변경 시 이 파일만 수정하면 됨
 * 사용 위치: MainText.tsx, LoginPage
 */
export const MARKET_LOGO_IMAGES = {
  KOREA: require("@/assets/images/mainText.png"),
  GLOBAL: require("@/assets/images/mainText-en.png"),
} as const;

/**
 * Market에 따른 로고 이미지 반환
 * null인 경우 KOREA로 폴백
 */
export const getMarketLogo = (market: Market | null): any => {
  return MARKET_LOGO_IMAGES[market === "GLOBAL" ? "GLOBAL" : "KOREA"];
};

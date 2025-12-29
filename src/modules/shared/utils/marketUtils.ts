import type { Market } from "../types/market";

/**
 * Market에 따라 WebView 로케일 경로를 반환합니다.
 *
 * @param market - KOREA 또는 GLOBAL
 * @returns 한국 마켓이면 "/ko", 글로벌 마켓이면 "/en"
 *
 * @example
 * getLocalePathFromMarket("KOREA") // "/ko"
 * getLocalePathFromMarket("GLOBAL") // "/en"
 */
export function getLocalePathFromMarket(market: Market): "/ko" | "/en" {
  return market === "KOREA" ? "/ko" : "/en";
}

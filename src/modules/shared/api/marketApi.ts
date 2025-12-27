import { clientWithoutAuth } from "./clientWithoutAuth";
import type { Market, MarketResponse, MarketConfig } from "../types/market";
import { getLocalePathFromMarket } from "../utils/marketUtils";

/**
 * 백엔드에서 현재 Market 정보 조회
 * Nginx GeoIP가 자동으로 X-Country-Code 헤더 추가
 *
 * 주의: 인증이 필요 없는 API이므로 clientWithoutAuth 사용
 */
export const getMarket = async (): Promise<MarketResponse> => {
  try {
    const response = await clientWithoutAuth.get<MarketResponse>("/market");
    return response.data;
  } catch (error) {
    console.error("Market 조회 실패, KOREA로 폴백:", error);

    // 폴백: API 요청 실패 시 한국으로 기본 설정
    return {
      market: "KOREA",
      country_code: "KR",
    };
  }
};

export function createMarketConfig(
  market: Market,
  countryCode: string
): MarketConfig {
  return {
    market,
    countryCode,
    webviewPath: getLocalePathFromMarket(market),
  };
}

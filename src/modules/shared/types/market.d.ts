export type Market = "KOREA" | "GLOBAL";

export interface MarketResponse {
  market: Market;
  country_code: string;
}

export interface MarketConfig {
  market: Market;
  countryCode: string;
  webviewPath: "/ko" | "/en";
}

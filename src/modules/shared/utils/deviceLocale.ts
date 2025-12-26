import { getLocales } from "expo-localization";
import type { Market } from "../types/market";

export const getMarketFromDeviceLocale = (): Market => {
  try {
    const locales = getLocales();
    const primaryLocale = locales[0];

    if (!primaryLocale) {
      console.warn("[Device Locale] locale 정보 없음, GLOBAL 폴백");
      return "GLOBAL";
    }

    const languageCode = primaryLocale.languageCode ?? "";
    console.debug("[Device Locale] Primary language:", languageCode);

    const market = languageCode === "ko" ? "KOREA" : "GLOBAL";
    console.debug("[Device Locale] Determined market:", market);

    return market;
  } catch (error) {
    console.error("[Device Locale] 확인 실패, GLOBAL 폴백:", error);
    return "GLOBAL";
  }
};

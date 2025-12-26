import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Market } from "../types/market";

const MARKET_CACHE_KEY = "cached_market";

export const getCachedMarket = async (): Promise<Market | null> => {
  try {
    const cached = await AsyncStorage.getItem(MARKET_CACHE_KEY);
    if (cached === "KOREA" || cached === "GLOBAL") {
      console.debug("[Market Cache] 캐시 Hit:", cached);
      return cached;
    }
    console.debug("[Market Cache] 캐시 Miss (값 없음)");
    return null;
  } catch (error) {
    console.error("[Market Cache] 읽기 실패:", error);
    return null;
  }
};

export const setCachedMarket = async (market: Market): Promise<void> => {
  try {
    await AsyncStorage.setItem(MARKET_CACHE_KEY, market);
    console.debug(`[Market Cache] 저장 완료: ${market}`);
  } catch (error) {
    console.error("[Market Cache] 저장 실패:", error);
  }
};

export const clearCachedMarket = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MARKET_CACHE_KEY);
    console.debug("[Market Cache] 캐시 삭제 완료");
  } catch (error) {
    console.error("[Market Cache] 삭제 실패:", error);
  }
};

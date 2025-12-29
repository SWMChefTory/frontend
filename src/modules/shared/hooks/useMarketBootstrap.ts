import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";
import { getMarket } from "../api/marketApi";
import {
  getCachedMarket,
  setCachedMarket as saveCachedMarket,
} from "../storage/marketCache";
import { getMarketFromDeviceLocale } from "../utils/deviceLocale";

export function useMarketBootstrap() {
  const { setMarket, setCachedMarket, setError, isLoading } = useMarketStore();

  useEffect(() => {
    const init = async () => {
      try {
        // Step 1: AsyncStorage 캐시 확인 (5-10ms)
        const cached = await getCachedMarket();

        if (cached) {
          console.debug("[Market Bootstrap] ✅ 캐시 사용:", cached);
          setCachedMarket(cached);
        } else {
          console.debug("[Market Bootstrap] ⚠️ 캐시 없음, device locale 사용");
          const fallbackMarket = getMarketFromDeviceLocale();
          setCachedMarket(fallbackMarket);
        }

        // Step 2: 서버에서 정확한 market 정보 받아오기 (백그라운드)
        const response = await getMarket();
        setMarket(response.market, response.country_code);

        // Step 3: AsyncStorage 캐시 업데이트 (다음 실행을 위해)
        await saveCachedMarket(response.market);
      } catch (error) {
        // getMarket()은 절대 reject하지 않음 (API 오류 시 KOREA 폴백 반환)
        // 이 catch는 예기치 않은 프로그래밍 오류만 처리
        console.error("[Market Bootstrap] ❌ 예기치 않은 에러:", error);
        setError(
          error instanceof Error ? error : new Error("Market Bootstrap 실패"),
        );
      }
    };

    init();
    // Zustand setters는 stable reference이므로 deps 불필요
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
}

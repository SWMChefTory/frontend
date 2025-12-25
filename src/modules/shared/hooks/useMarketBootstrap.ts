import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";
import { getMarket } from "../api/marketApi";

export function useMarketBootstrap() {
  const { setMarket, setError, isLoading } = useMarketStore();

  useEffect(() => {
    const init = async () => {
      // marketStore 초기값이 이미 isLoading: true이므로 setLoading(true) 불필요
      try {
        const response = await getMarket();
        setMarket(response.market, response.country_code);
      } catch (error) {
        // getMarket()은 절대 reject하지 않음 (API 오류 시 KOREA 폴백 반환)
        // 이 catch는 예기치 않은 프로그래밍 오류만 처리
        console.error("Market Bootstrap 예기치 않은 에러:", error);
        setError(
          error instanceof Error ? error : new Error("Market Bootstrap 실패"),
        );
      }
    };

    init();
  }, [setMarket, setError]);

  return { isLoading };
}

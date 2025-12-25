import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";
import { getMarket } from "../api/marketApi";

export function useMarketBootstrap() {
  const { setMarket, setLoading, setError, isLoading } = useMarketStore();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const response = await getMarket();
        setMarket(response.market, response.country_code);

        console.log(
          `Market 초기화 완료: ${response.market} (${response.country_code})`,
        );
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
  }, [setMarket, setLoading, setError]);

  return { isLoading };
}

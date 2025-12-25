import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";
import { getMarket } from "../api/marketApi";

export function useMarketBootstrap() {
  const { setMarket, setLoading, setError, isLoading } = useMarketStore();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const response = await getMarket();
        setMarket(response.market, response.country_code);

        console.log(`Market 초기화 완료: ${response.market} (${response.country_code})`);
      } catch (error) {
        console.error("Market Bootstrap 실패:", error);
        setError(error instanceof Error ? error : new Error("Market 조회 실패"));

        // 폴백: 한국으로 설정
        setMarket("KOREA", "KR");
      }
    };

    init();
  }, [setMarket, setLoading, setError]);

  return { isLoading };
}

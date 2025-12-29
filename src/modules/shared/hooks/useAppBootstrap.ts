import { useAuthBootstrap } from "@/src/modules/user/authBootstrap";
import { useMarketBootstrap } from "./useMarketBootstrap";

/**
 * 앱 전체 Bootstrap 통합 관리
 *
 * Auth와 Market bootstrap을 통합하여 중앙 집중식으로 관리합니다.
 * 모든 bootstrap이 완료되어야 앱이 준비된 것으로 간주합니다.
 *
 * @returns {Object} Bootstrap 상태
 * @returns {boolean} isReady - 앱이 사용 가능한 상태인지 (Auth + Market 완료)
 * @returns {boolean} isLoggedIn - 사용자 인증 상태
 *
 * @example
 * const { isReady, isLoggedIn } = useAppBootstrap();
 *
 * if (!isReady) {
 *   return <SplashScreen />;
 * }
 *
 * return (
 *   <Stack.Protected guard={isLoggedIn}>
 *     <App />
 *   </Stack.Protected>
 * );
 */
export function useAppBootstrap() {
  const { loading: authLoading, isLoggedIn } = useAuthBootstrap();
  const { isLoading: marketLoading } = useMarketBootstrap();

  // 모든 bootstrap이 완료되어야 앱 준비 완료
  const isReady = !authLoading && !marketLoading;

  return {
    isReady, // 앱이 사용 가능한 상태인지
    isLoggedIn, // 사용자 인증 상태
  };
}

import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import * as Linking from "expo-linking";
import { deepLinkActionStore, DeepLinkAction } from "./deepLinkActionStore";
import { router } from "expo-router";

// 딥링크 관리 훅
export function useDeepLinkHandler() {
  const appState = useRef(AppState.currentState);
  const isAppLaunch = useRef(true);
  const { setDeepLinkAction } = deepLinkActionStore();

  useEffect(() => {
    let linkingSubscription: any;

    // 초기 URL 확인 (앱이 꺼진 상태에서 딥링크로 시작)
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleExternalDeepLink(initialUrl);
      }

      isAppLaunch.current = false;
    };

    // 앱 상태 변화 감지
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        appState.current = nextAppState;
      }
    );

    // 딥링크 리스너
    linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      const parsedUrl = Linking.parse(url);
      const isFromExternal = parsedUrl.queryParams?.external === "true";
      console.log("isFromExternal", isFromExternal);
      if (isFromExternal) {
        handleExternalDeepLink(url);
      } else {
        handleInternalNavigation(url);
      }
    });

    console.log("handleInitialURL");
    handleInitialURL();

    return () => {
      appStateSubscription?.remove();
      linkingSubscription?.remove();
    };
  }, []);

  const handleExternalDeepLink = (url: string) => {
    const parsedUrl = Linking.parse(url);
    const queryParams = parsedUrl.queryParams;
    if (
      url.includes("expo-development-client") ||
      url.includes("com.googleusercontent.apps") ||
      url.startsWith("com.googleusercontent.apps")
    ) {
      console.log("시스템 개발 URL 무시:", url);
      return;
    }

    console.log("External deep link:", {
      url,
      source: parsedUrl.queryParams?.source || "unknown",
      timestamp: new Date().toISOString(),
    });

    if (!parsedUrl.hostname) {
      if (queryParams?.["video-id"]) {
        setDeepLinkAction({
          actionType: "create",
          params: {
            youtubeUrl: ("https://www.youtube.com/watch?v=" +
              queryParams?.["video-id"]) as string,
          },
        });
        // router.replace('/(tabs)');
        return;
      }
    }

    throw new Error(` 예상치 못한 딥링크 경로: ${url}`);
  };

  const handleInternalNavigation = (url: string) => {
    // 앱 내부 네비게이션은 기본 처리
    console.log("Internal navigation:", url);
  };
}

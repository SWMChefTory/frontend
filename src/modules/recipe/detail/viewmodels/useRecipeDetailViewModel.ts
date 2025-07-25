import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";
import { WebView } from "react-native-webview";
import { getWebViewUrl, WEBVIEW_CONFIG } from "../constants/WebViewConfig";
import { useBackHandler } from "../hooks/useBackHandler";
import { useWebViewMessage } from "../hooks/useWebViewMessage";
import {
  RecipeDetailParams,
  RecipeDetailState,
  WebViewNavigationState,
} from "../types/RecipeDetail";

export function useRecipeDetailViewModel(params: RecipeDetailParams) {
  const webviewRef = useRef<WebView>(null);
  const [state, setState] = useState<RecipeDetailState>({
    isLoading: true,
    canGoBack: false,
    webViewKey: 0,
  });

  const webviewUrl = getWebViewUrl(params.recipeId);

  const setCanGoBack = useCallback((canGoBack: boolean) => {
    setState((prev) => ({ ...prev, canGoBack }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const incrementWebViewKey = useCallback(() => {
    setState((prev) => ({ ...prev, webViewKey: prev.webViewKey + 1 }));
  }, []);

  // 커스텀 훅들 사용
  const { handleMessage, clearWebViewHistoryByReload } = useWebViewMessage({
    webviewRef,
    setCanGoBack,
  });

  useBackHandler({
    webviewRef,
    canGoBack: state.canGoBack,
  });

  // WebView 이벤트 핸들러들
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigationState) => {
      setCanGoBack(navState.canGoBack);
    },
    [setCanGoBack],
  );

  const handleError = useCallback(
    (error: any) => {
      console.error("WebView 오류:", error);
      setIsLoading(false);
      Alert.alert(
        WEBVIEW_CONFIG.ERROR_MESSAGES.LOAD_ERROR,
        WEBVIEW_CONFIG.ERROR_MESSAGES.LOAD_ERROR_DESCRIPTION,
        [
          {
            text: WEBVIEW_CONFIG.ERROR_MESSAGES.BACK_BUTTON_TEXT,
            onPress: () => router.back(),
          },
          {
            text: WEBVIEW_CONFIG.ERROR_MESSAGES.RETRY_BUTTON_TEXT,
            onPress: () => setIsLoading(true),
          },
        ],
      );
    },
    [setIsLoading],
  );

  const handleHttpError = useCallback(
    (error: any) => {
      console.error("HTTP 오류:", error);
      setIsLoading(false);
    },
    [setIsLoading],
  );

  return {
    // State
    ...state,
    webviewUrl,
    webviewRef,

    // Handlers
    handleMessage,
    handleLoadStart,
    handleLoadEnd,
    handleNavigationStateChange,
    handleError,
    handleHttpError,

    // Actions
    clearWebViewHistoryByReload,
    incrementWebViewKey,
  };
}

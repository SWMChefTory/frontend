import { TimerMessage } from "@/src/modules/recipe/detail/types/RecipeDetail";
import { useRecipeDetailViewModel } from "@/src/modules/recipe/detail/viewmodels/useRecipeDetailViewModel";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { findAccessToken } from "@/src/modules/shared/storage/SecureStorage";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { getUserAgent, getWebViewUrl } from "../constants/WebViewConfig";
import { useWebViewMessage } from "../hooks/useWebViewMessage";
import { RecipeWebViewFallback } from "./Fallback";

interface RecipeWebViewProps {
  recipeId: string;
  onOpenTimer: (data: TimerMessage) => void;
}

export function RecipeWebView({ recipeId, onOpenTimer }: RecipeWebViewProps) {
  return (
    <ApiErrorBoundary fallbackComponent={RecipeWebViewFallback}>
      <RecipeWebViewContent recipeId={recipeId} onOpenTimer={onOpenTimer} />
    </ApiErrorBoundary>
  );
}

export function RecipeWebViewContent({
  recipeId,
  onOpenTimer,
}: RecipeWebViewProps) {
  const webviewRef = useRef<WebView>(null);
  const [error, setError] = useState<Error | null>(null);
  const { accessToken, refetch } = useRecipeDetailViewModel();
  const url = getWebViewUrl(recipeId);
  const navigation = useNavigation();

  const { handleMessage } = useWebViewMessage({
    webviewRef,
    timerCallbacks: {
      onTimerStart: (data) => {
        onOpenTimer(data);
      },
      onTimerStop: (data) => {
        onOpenTimer(data);
      },
      onTimerCheck: (data) => {
        onOpenTimer(data);
      },
      onTimerSet: (data) => {
        onOpenTimer(data);
      },
    },
    refreshTokenCallback: async () => {
      console.log("[Native] 웹뷰에서 토큰 재발급 요청 받음");
      await refetch();
      const newToken = await findAccessToken();
      if (webviewRef.current && newToken) {
        const payload = JSON.stringify({
          type: "ACCESS_TOKEN",
          token: newToken,
        });
        const js = `window.postMessage(${payload}, '*'); true;`;
        webviewRef.current.injectJavaScript(js);
        console.log(`[Native] 액세스 토큰을 웹뷰로 전송: ${newToken}`);
      }
    },
  });
  const handleError = useCallback((error: any) => {
    setError(
      new Error(
        `WebView 에러: ${error.nativeEvent?.description || "Unknown error"}`,
      ),
    );
  }, []);

  const handleHttpError = useCallback((error: any) => {
    setError(
      new Error(
        `HTTP 오류: ${error.nativeEvent?.statusCode} - ${error.nativeEvent?.description}`,
      ),
    );
  }, []);

  const handleWebViewLoadEnd = useCallback(() => {
    if (webviewRef.current && accessToken) {
      const payload = JSON.stringify({
        type: "ACCESS_TOKEN",
        token: accessToken,
      });
      const js = `window.postMessage(${payload}, '*'); true;`;
      webviewRef.current.injectJavaScript(js);
    }
  }, [accessToken]);

  // Android 하드웨어 뒤로가기 버튼 처리: 웹뷰로 BACK_PRESSED 전송
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (webviewRef.current) {
          const payload = JSON.stringify({ type: "BACK_PRESSED" });
          const js = `window.postMessage(${payload}, '*'); true;`;
          webviewRef.current.injectJavaScript(js);
          return true; // 기본 뒤로가기 동작 소모
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, []);

  // iOS 스와이프 제스처 등 네비게이션 이탈 직전: 웹뷰로 BACK_PRESSED 전송
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      const actionType = e?.data?.action?.type;
      // POP/GO_BACK 같은 사용자 뒤로가기만 가로채고, REPLACE/NAVIGATE 등은 통과
      if (actionType && actionType !== "GO_BACK") {
        return;
      }
      if (webviewRef.current) {
        e.preventDefault();
        const payload = JSON.stringify({ type: "BACK_PRESSED" });
        const js = `window.postMessage(${payload}, '*'); true;`;
        webviewRef.current.injectJavaScript(js);
      }
    });
    return unsubscribe;
  }, [navigation]);

  if (error) {
    throw error;
  }

  return (
    <WebView
      injectedJavaScript={`
      (function() {
        const originalLog = console.log;
        console.log = function(...args) {
          window.ReactNativeWebView.postMessage(args.join(" "));
          originalLog.apply(console, args);
        };
      })();
      true;
    `}
      ref={webviewRef}
      source={{ uri: url }}
      style={styles.webview}
      onLoadEnd={handleWebViewLoadEnd}
      userAgent={getUserAgent()}
      onMessage={handleMessage}
      onError={handleError}
      onHttpError={handleHttpError}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      mediaCapturePermissionGrantType="grant"
      allowsFullscreenVideo={true}
      allowsBackForwardNavigationGestures={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={false}
      cacheEnabled={true}
      {...(Platform.OS === "ios" && {
        allowsLinkPreview: false,
        automaticallyAdjustContentInsets: false,
        scrollEnabled: true,
        bounces: false,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      })}
      {...(Platform.OS === "android" && {
        mixedContentMode: "compatibility",
        thirdPartyCookiesEnabled: true,
        allowFileAccess: true,
        allowUniversalAccessFromFileURLs: true,
        setSupportMultipleWindows: false,
      })}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "white",
  },
});

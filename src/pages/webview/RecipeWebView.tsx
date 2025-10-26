import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { useCallback, useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { getUserAgent, getWebViewUrl } from "./WebViewConfig";
import { RecipeWebViewFallback } from "./Fallback";
import { Platform, StyleSheet } from "react-native";
import { useHandleMessage } from "@/src/pages/webview/message/useHandleMessage";
import { subscribeMessage } from "@/src/shared/webview/sendMessage";
import { WebviewLoadingView } from "@/src/pages/webview/load/LoadingView";
import { useLoadStore } from "./load/loadStore";
import { useKeyboardAvoidingAnimation } from "@/src/shared/keyboard/useKeyboardAvoiding";
import Animated from "react-native-reanimated";
import {
  findRefreshToken,
  findAccessToken,
} from "@/src/modules/shared/storage/SecureStorage";

export function RecipeWebView() {
  return <RecipeWebViewContent />;
}

export function RecipeWebViewContent() {
  const webviewRef = useRef<WebView>(null);
  const [error, setError] = useState<Error | null>(null);
  const { isLoading } = useLoadStore();
  const { handleMessage } = useHandleMessage({
    postMessage: ({ message }) => {
      webviewRef.current?.postMessage(message);
    },
  });

  const { animatedStyle } = useKeyboardAvoidingAnimation();

  useEffect(() => {
    subscribeMessage((message) => {
      webviewRef.current?.postMessage(message);
    });
  }, []);

  const handleError = useCallback((error: any) => {
    setError(
      new Error(
        `WebView 에러: ${error.nativeEvent?.description || "Unknown error"}`
      )
    );
  }, []);

  const handleHttpError = useCallback((error: any) => {
    setError(
      new Error(
        `HTTP 오류: ${error.nativeEvent?.statusCode} - ${error.nativeEvent?.description}`
      )
    );
  }, []);

  const webviewUrl = getWebViewUrl();

  if (error) {
    throw error;
  }

  return (
    <>
      <Animated.View style={[animatedStyle, { flex: 1 }]}>
        <WebView
          injectedJavaScript={`
        (function() {
          const originalLog = console.log;
          console.log = function(...args) {
            window.ReactNativeWebView.postMessage(args.join(" "));
            originalLog.apply(console, args);
             localStorage.setItem('MAIN_ACCESS_TOKEN', '${findAccessToken() || ""}');
             localStorage.setItem('REFRESH_TOKEN', '${findRefreshToken() || ""}');
          };
        })();
        true;
      `}
          ref={webviewRef}
          source={{ uri: webviewUrl }}
          style={[styles.webview]}
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
            bounces: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            automaticallyAdjustScrollIndicatorInsets: false,
          })}
          {...(Platform.OS === "android" && {
            mixedContentMode: "compatibility",
            thirdPartyCookiesEnabled: true,
            allowFileAccess: true,
            allowUniversalAccessFromFileURLs: true,
            setSupportMultipleWindows: false,
          })}
        />
        {isLoading && <WebviewLoadingView />}
      </Animated.View>
    </>
  );
  // Android 하드웨어 뒤로가기 버튼 처리: 웹뷰로 BACK_PRESSED 전송
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "white",
    width: "100%", // 명시적으로 전체 너비 지정
  },
});

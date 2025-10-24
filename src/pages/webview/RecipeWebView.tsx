import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { useCallback, useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { getUserAgent, getWebViewUrl } from "./WebViewConfig";
import { RecipeWebViewFallback } from "./Fallback";
import { Platform, StyleSheet } from "react-native";
import { RecipeCreatingView } from "@/src/widgets/create-recipe-view/recipeCreatingView";
import { useHandleMessage } from "@/src/pages/webview/message/useHandleMessage";
import {
  subscribeMessage,
} from "@/src/shared/webview/sendMessage";
import { CategoryCreatingView } from "@/src/widgets/create-category-view/categoryCreatingView";

export function RecipeWebView() {
  return (
    <ApiErrorBoundary fallbackComponent={RecipeWebViewFallback}>
      <RecipeWebViewContent />
    </ApiErrorBoundary>
  );
}

export function RecipeWebViewContent() {
  const webviewRef = useRef<WebView>(null);
  const [error, setError] = useState<Error | null>(null);
  const { handleMessage } = useHandleMessage({
    postMessage: ({ message }) => {
      webviewRef.current?.postMessage(message);
    },
  });

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
        source={{ uri: webviewUrl }}
        style={styles.webview}
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
        // onLoadEnd={() => {
          
        //   console.log("[onLoadEnd] 로드되었어요!");
        // }}
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
      <RecipeCreatingView />
      <CategoryCreatingView />
    </>
  );
  // Android 하드웨어 뒤로가기 버튼 처리: 웹뷰로 BACK_PRESSED 전송
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "white",
    width: "100%", // 명시적으로 전체 너비 지정
    height: "100%",
  },
});

// const { handleMessage } = useWebViewMessage({
//   webviewRef,
//   timerCallbacks: {
//     onTimerStart: (data) => {
//       onOpenTimer(data);
//     },
//     onTimerStop: (data) => {
//       onOpenTimer(data);
//     },
//     onTimerCheck: (data) => {
//       onOpenTimer(data);
//     },
//     onTimerSet: (data) => {
//       onOpenTimer(data);
//     },
//   },
//   refreshTokenCallback: async () => {
//     console.log("[Native] 웹뷰에서 토큰 재발급 요청 받음");
//     await refetch();
//     const newToken = await findAccessToken();
//     if (webviewRef.current && newToken) {
//       const payload = JSON.stringify({
//         type: "ACCESS_TOKEN",
//         token: newToken,
//       });
//       const js = `window.postMessage(${payload}, '*'); true;`;
//       webviewRef.current.injectJavaScript(js);
//       console.log(`[Native] 액세스 토큰을 웹뷰로 전송: ${newToken}`);
//     }
//   },
//   orientation: {
//     lockToPortraitUp: async () => {
//       ScreenOrientation.lockAsync(
//         ScreenOrientation.OrientationLock.PORTRAIT_UP
//       );
//     },
//     lockToLandscapeLeft: async () => {
//       ScreenOrientation.lockAsync(
//         ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
//       );
//     },
//     unlockOrientation: async () => {
//       ScreenOrientation.unlockAsync();
//     },
//   },
// });

  import { TimerMessage } from "@/src/modules/recipe/detail/types/RecipeDetail";
  import { useRecipeDetailViewModel } from "@/src/modules/recipe/detail/viewmodels/useRecipeDetailViewModel";
  import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
  import { findAccessToken } from "@/src/modules/shared/storage/SecureStorage";
  import { useCallback, useMemo, useRef, useState } from "react";
  import { Platform, StyleSheet } from "react-native";
  import { WebView } from "react-native-webview";
  import { getUserAgent, getWebViewUrl } from "../constants/WebViewConfig";
  import { useWebViewMessage } from "../hooks/useWebViewMessage";
  import { RecipeWebViewFallback } from "./Fallback";
  import * as ScreenOrientation from "expo-screen-orientation";
  import { useSafeAreaInsets } from "react-native-safe-area-context";


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
    const insets = useSafeAreaInsets();

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
      orientation:{
        lockToPortraitUp: async () => {
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        },
        lockToLandscapeLeft: async () => {
          console.log("가로모드");
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
        },
        unlockOrientation: async () => {
          ScreenOrientation.unlockAsync();
        },
      }
    });
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

    const handleWebViewLoadEnd = useCallback(() => {
      if(webviewRef.current){
        const payload = JSON.stringify({
          type: "SAFE_AREA",
          safe_area: insets,
        });
        webviewRef.current.injectJavaScript(`
          window.postMessage(${payload}, '*'); true;
        `);

        console.log(`[Native] 안전 영역을 웹뷰로 전송: ${payload}`);
      }
      if (webviewRef.current && accessToken) {
        const payload = JSON.stringify({
          type: "ACCESS_TOKEN",
          token: accessToken,
        });
        const js = `window.postMessage(${payload}, '*'); true;`;
        webviewRef.current.injectJavaScript(js);

        console.log(`[Native] 액세스 토큰을 웹뷰로 전송: ${accessToken}`);
      }
    }, [accessToken]);

    if (error) {
      throw error;
    }

    // const webInsets = {
    //   top: insets.top ,
    //   bottom: insets.bottom ,
    //   left: insets.left ,
    //   right: insets.right 
    // };

    const webviewUrl = useMemo(() => {
      const baseUrl = getWebViewUrl(recipeId);
      return baseUrl;
    }, [recipeId]);

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
        source={{ uri: webviewUrl }}
        style={styles.webview}
        onLoadEnd={handleWebViewLoadEnd}
        // onLoadStart={handleWebViewLoadStart}
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
          // automaticallyAdjustContentInsets: false,
          // contentInset: { top: 30, left: 0, bottom: 30, right: 0 },
          scrollEnabled: true,
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
    );
  }

  const styles = StyleSheet.create({
    webview: {
      flex: 1,
      backgroundColor: "white",
      width: '100%', // 명시적으로 전체 너비 지정
      height: '100%',
    },
  });

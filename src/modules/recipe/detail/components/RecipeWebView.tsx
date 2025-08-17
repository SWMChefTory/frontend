import React, { useCallback, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { getUserAgent, getWebViewUrl } from "../constants/WebViewConfig";
import { useWebViewMessage } from "../hooks/useWebViewMessage";
import { findAccessToken } from "@/src/modules/shared/storage/SecureStorage";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { RecipeWebViewFallback } from "./Fallback";

interface RecipeWebViewProps {
  recipeId: string;
}

export function RecipeWebView ({
  recipeId,
}: RecipeWebViewProps) {
  return  (
    <ApiErrorBoundary fallbackComponent={RecipeWebViewFallback}>
      <RecipeWebViewContent recipeId={recipeId} />
    </ApiErrorBoundary>
  );
}

export function RecipeWebViewContent({
  recipeId,
}: RecipeWebViewProps) {

  const webviewRef = useRef<WebView>(null);
  const [error, setError] = useState<Error | null>(null);

  const accessToken = findAccessToken();  
  const url = getWebViewUrl(recipeId);

  const { handleMessage } = useWebViewMessage({
    webviewRef,
  });

  const handleError = useCallback((error: any) => {
    setError(new Error(`WebView 에러: ${error.nativeEvent?.description || 'Unknown error'}`));
  }, []);

  const handleHttpError = useCallback((error: any) => {
    setError(new Error(`HTTP 오류: ${error.nativeEvent?.statusCode} - ${error.nativeEvent?.description}`));
  }, []);
  

  const handleWebViewLoadEnd = (syntheticEvent: any) => {

    if (webviewRef.current && accessToken) {
      const payload = JSON.stringify({
        type: "ACCESS_TOKEN",
        token: accessToken,
      });
      const js = `window.postMessage(${payload}, '*'); true;`;
      webviewRef.current.injectJavaScript(js);

      console.log(`[Native] 액세스 토큰을 웹뷰로 전송: ${accessToken}`);
    }
  };

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
      userAgent={getUserAgent()}
      onMessage={handleMessage}
      onLoadEnd={handleWebViewLoadEnd}
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
        onPermissionRequest: (request: any) => {
          request.grant();
        },
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

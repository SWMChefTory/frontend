import React from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { getUserAgent } from "../constants/WebViewConfig";
import { WebViewNavigationState } from "../types/RecipeDetail";

interface RecipeWebViewProps {
  webViewRef: React.RefObject<WebView | null>;
  url: string;
  webViewKey: number;
  onMessage: (event: any) => void;
  onLoadStart: () => void;
  onLoadEnd: () => void; // 이 prop은 이제 웹뷰로 토큰을 보내는 로직을 포함하게 됩니다.
  onNavigationStateChange: (navState: WebViewNavigationState) => void;
  onError: (error: any) => void;
  onHttpError: (error: any) => void;
  accessToken: string | null;
}

export function RecipeWebView({
  webViewRef,
  url,
  webViewKey,
  onMessage,
  onLoadStart,
  onLoadEnd, // 이 prop을 직접 WebView에 전달
  onNavigationStateChange,
  onError,
  onHttpError,
  accessToken,
}: RecipeWebViewProps) {
  // 기존 onLoadEnd 콜백을 감싸고, 여기에 웹뷰로 토큰을 보내는 로직을 추가
  const handleWebViewLoadEnd = (syntheticEvent: any) => {
    if (onLoadEnd) {
      onLoadEnd();
    }

    if (webViewRef.current && accessToken) {
      const payload = JSON.stringify({
        type: "ACCESS_TOKEN",
        token: accessToken,
      });
      const js = `window.postMessage(${payload}, '*'); true;`;
      webViewRef.current.injectJavaScript(js);

      console.log(`[Native] 액세스 토큰을 웹뷰로 전송: ${accessToken}`);
    }
  };

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
      key={webViewKey}
      ref={webViewRef}
      source={{ uri: url }}
      style={styles.webview}
      userAgent={getUserAgent()}
      onMessage={onMessage}
      onLoadStart={onLoadStart}
      onLoadEnd={handleWebViewLoadEnd}
      onNavigationStateChange={onNavigationStateChange}
      onError={onError}
      onHttpError={onHttpError}
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

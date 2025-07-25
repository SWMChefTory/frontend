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
  onLoadEnd: () => void;
  onNavigationStateChange: (navState: WebViewNavigationState) => void;
  onError: (error: any) => void;
  onHttpError: (error: any) => void;
}

export function RecipeWebView({
  webViewRef,
  url,
  webViewKey,
  onMessage,
  onLoadStart,
  onLoadEnd,
  onNavigationStateChange,
  onError,
  onHttpError,
}: RecipeWebViewProps) {
  return (
    <WebView
      key={webViewKey}
      ref={webViewRef}
      source={{ uri: url }}
      style={styles.webview}
      userAgent={getUserAgent()}
      onMessage={onMessage}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onNavigationStateChange={onNavigationStateChange}
      onError={onError}
      onHttpError={onHttpError}
      // 미디어 재생 최적화 설정
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      mediaCapturePermissionGrantType="grant"
      // 추가 권한 설정
      allowsFullscreenVideo={true}
      allowsBackForwardNavigationGestures={true}
      // JavaScript 및 DOM 설정
      javaScriptEnabled={true}
      domStorageEnabled={true}
      // 성능 최적화 설정
      startInLoadingState={false}
      cacheEnabled={true}
      // iOS 전용 최적화
      {...(Platform.OS === "ios" && {
        allowingReadAccessToURL: "http://localhost:3000",
        allowsLinkPreview: false,
        automaticallyAdjustContentInsets: false,
        scrollEnabled: true,
        bounces: false,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      })}
      // Android 전용 최적화
      {...(Platform.OS === "android" && {
        mixedContentMode: "compatibility",
        thirdPartyCookiesEnabled: true,
        allowFileAccess: true,
        allowUniversalAccessFromFileURLs: true,
        setSupportMultipleWindows: false,
        // 권한 요청 처리 (Android)
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

import { useCallback, useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { getUserAgent, getWebViewUrl } from "./WebViewConfig";
import { BackHandler, Platform, StyleSheet, View } from "react-native";
import { useHandleMessage } from "@/src/pages/webview/message/useHandleMessage";
import { subscribeMessage } from "@/src/shared/webview/sendMessage";
import { useKeyboardAvoidingAnimation } from "@/src/shared/keyboard/useKeyboardAvoiding";
import Animated from "react-native-reanimated";
import {
  findRefreshToken,
  findAccessToken,
} from "@/src/modules/shared/storage/SecureStorage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { tryGrantPermission } from "./timer/notifications/timerNotifications";
import { WebviewLoadingView } from "./load/LoadingView";


export function RecipeWebView() {
  return <RecipeWebViewContent />;
}

export type SafeAreaProps = { 
  isEixsts: boolean;
  color: string;
};

export type SafeArea = {
  left: SafeAreaProps;
  right: SafeAreaProps;
  top: SafeAreaProps;
  bottom: SafeAreaProps;
};

export function RecipeWebViewContent() {
  const webviewRef = useRef<WebView>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  useFocusEffect(useCallback(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack) { webviewRef.current?.goBack(); return true; } // ← 앱 종료 막고 웹 뒤로
      return false; // 뒤로갈 데 없으면 기본(종료) 또는 여기서 confirm
    });
    return () => sub.remove();
  }, [canGoBack]));
  
  useEffect(()=>{
    tryGrantPermission();
  },[]);

  const [safeArea, setSafeArea] = useState<SafeArea>({
    left: { isEixsts: false, color: "#FFFFFF" },
    right: { isEixsts: false, color: "#FFFFFF" },
    top: { isEixsts: false, color: "#FFFFFF" },
    bottom: { isEixsts: false, color: "#FFFFFF" },
  });

  const { handleMessage } = useHandleMessage({
    postMessage: ({ message }) => {
      webviewRef.current?.postMessage(message);
    },
    setSafeArea,
  });
  const insets = useSafeAreaInsets();

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

  useFocusEffect(useCallback(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      console.log("canGoBack", canGoBack);
      if (canGoBack) { webviewRef.current?.goBack(); return true; } // ← 앱 종료 막고 웹 뒤로
      return false; // 뒤로갈 데 없으면 기본(종료) 또는 여기서 confirm
    });
    return () => sub.remove();
  }, [canGoBack]));

  const webviewUrl = getWebViewUrl();

  if (error) {
    throw error;
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: safeArea.top.isEixsts ? insets.top : 0,
          backgroundColor: safeArea.top.color,
        }}
      />
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            width: safeArea.left.isEixsts ? insets.left : 0,
            backgroundColor: safeArea.left.color,
          }}
        />
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
            onRenderProcessGone={(e) => {
              webviewRef.current?.reload();
            }}
            onLoadEnd={()=>{
              setIsLoading(false);
            }}
            onContentProcessDidTerminate={() => {
              webviewRef.current?.reload();
            }}
            onNavigationStateChange={s => setCanGoBack(s.canGoBack)}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            mediaCapturePermissionGrantType="grant"
            allowsFullscreenVideo={true}
            allowsBackForwardNavigationGestures={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            cacheEnabled={true}
            webviewDebuggingEnabled={true}
            {...(Platform.OS === "ios" && {
              hideKeyboardAccessoryView: true,
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
        <View
          style={{
            width: safeArea.right.isEixsts ? insets.right : 0,
            backgroundColor: safeArea.right.color,
          }}
        />
      </View>
      <View
        style={{
          height: safeArea.bottom.isEixsts ? insets.bottom : 0,
          backgroundColor: safeArea.bottom.color,
        }}
      />
    </View>
  );
  // Android 하드웨어 뒤로가기 버튼 처리: 웹뷰로 BACK_PRESSED 전송
}

// {isLoading && <WebviewLoadingView/>}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "white",
    width: "100%", // 명시적으로 전체 너비 지정
  },
});

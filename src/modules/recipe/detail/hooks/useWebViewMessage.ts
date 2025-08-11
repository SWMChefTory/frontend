import { refreshToken } from "@/src/modules/shared/api/client";
import { router } from "expo-router";
import { useCallback } from "react";
import { WebView } from "react-native-webview";
import { WebViewMessage, WebViewMessageType } from "../types/RecipeDetail";

interface UseWebViewMessageProps {
  webviewRef: React.RefObject<WebView | null>;
  setCanGoBack: (value: boolean) => void;
}

export function useWebViewMessage({
  webviewRef,
  setCanGoBack,
}: UseWebViewMessageProps) {
  const clearWebViewHistoryByReload = useCallback(() => {
    if (webviewRef.current) {
      webviewRef.current.reload();
      setCanGoBack(false);
    }
  }, [webviewRef, setCanGoBack]);

  const clearWebViewHistoryByJavaScript = useCallback(() => {
    if (webviewRef.current) {
      const jsCode = `
        window.history.replaceState(null, '', window.location.href);
        true;
      `;

      webviewRef.current.injectJavaScript(jsCode);
      setCanGoBack(false);
    }
  }, [webviewRef, setCanGoBack]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const message = event.nativeEvent.data;
        console.log("웹뷰에서 받은 메시지:", message);

        let parsedMessage: WebViewMessage;
        try {
          parsedMessage = JSON.parse(message);
        } catch {
          parsedMessage = { type: message };
        }

        switch (parsedMessage.type) {
          case WebViewMessageType.FINISH_COOKING:
            console.log("조리 종료. 첫 화면으로 이동합니다.");
            router.replace("/(app)/(tabs)");
            break;

          case WebViewMessageType.BACK_PRESSED:
            router.back();
            clearWebViewHistoryByReload();
            break;

          case WebViewMessageType.CLEAR_HISTORY:
            clearWebViewHistoryByReload();
            break;

          case WebViewMessageType.REFRESH_TOKEN:
            (async () => {
              const newToken = await refreshToken();
              if (webviewRef.current && newToken) {
                const payload = JSON.stringify({
                  type: "ACCESS_TOKEN",
                  token: newToken,
                });
                const js = `window.postMessage(${payload}, "*"); true;`;
                webviewRef.current.injectJavaScript(js);
              }
            })();
            break;

          default:
            console.log("처리되지 않은 메시지 타입:", parsedMessage.type);
        }
      } catch (error) {
        console.error("메시지 처리 중 오류:", error);
      }
    },
    [clearWebViewHistoryByReload]
  );

  return {
    handleMessage,
    clearWebViewHistoryByReload,
    clearWebViewHistoryByJavaScript,
  };
}

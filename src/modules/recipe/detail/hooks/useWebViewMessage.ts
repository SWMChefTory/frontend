import { refreshToken } from "@/src/modules/shared/api/client";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { WebView } from "react-native-webview";
import {
  TimerMessage,
  WebViewMessage,
  WebViewMessageType,
} from "../types/RecipeDetail";

interface UseWebViewMessageProps {
  webviewRef: React.RefObject<WebView | null>;
  timerCallbacks?: {
    onTimerStart?: (data: TimerMessage) => void;
    onTimerStop?: (data: TimerMessage) => void;
    onTimerCheck?: (data: TimerMessage) => void;
    onTimerSet?: (data: TimerMessage) => void;
  };
}

export function useWebViewMessage({
  webviewRef,
  timerCallbacks,
}: UseWebViewMessageProps) {
  const clearWebViewHistoryByReload = useCallback(() => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  }, [webviewRef]);

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
            router.replace("/(app)/(tabs)");
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

          case WebViewMessageType.TIMER_START:
            timerCallbacks?.onTimerStart?.(parsedMessage as TimerMessage);
            break;

          case WebViewMessageType.TIMER_STOP:
            console.log("타이머 중지 요청", parsedMessage);
            timerCallbacks?.onTimerStop?.(parsedMessage as TimerMessage);
            break;

          case WebViewMessageType.TIMER_CHECK:
            console.log("타이머 확인 요청", parsedMessage);

            // 테스트용으로 timer_time을 60초로 강제 세팅
            timerCallbacks?.onTimerSet?.({
              ...parsedMessage,
              timer_time: "60",
            } as TimerMessage);

            // 필요 시 원래 콜백도 주석 해제 가능
            // timerCallbacks?.onTimerCheck?.(parsedMessage as TimerMessage);
            break;

          case WebViewMessageType.TIMER_SET:
            timerCallbacks?.onTimerSet?.(parsedMessage as TimerMessage);
            break;

          default:
            console.log("처리되지 않은 메시지 타입:", parsedMessage.type);
        }
      } catch (error) {
        console.error("메시지 처리 중 오류:", error);
      }
    },
    [clearWebViewHistoryByReload, timerCallbacks], // timerCallbacks 추가
  );

  return {
    handleMessage,
  };
}

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
  refreshTokenCallback: () => Promise<void>;
}

export function useWebViewMessage({
  webviewRef,
  timerCallbacks,
  refreshTokenCallback,
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

        let parsedMessage: WebViewMessage;
        try {
          parsedMessage = JSON.parse(message);
        } catch {
          parsedMessage = { type: message };
        }

        switch (parsedMessage.type) {
          case WebViewMessageType.GO_HOME:
            router.replace("/(app)/(tabs)");
            break;

          case WebViewMessageType.REFRESH_TOKEN:
            refreshTokenCallback();
            break;

          case WebViewMessageType.TIMER_START:
            timerCallbacks?.onTimerStart?.(parsedMessage as TimerMessage);
            break;

          case WebViewMessageType.TIMER_STOP:
            timerCallbacks?.onTimerStop?.(parsedMessage as TimerMessage);
            break;

          case WebViewMessageType.TIMER_CHECK:
            timerCallbacks?.onTimerCheck?.(parsedMessage as TimerMessage);
            break;

          case WebViewMessageType.TIMER_SET:
            timerCallbacks?.onTimerSet?.(parsedMessage as TimerMessage);
            break;
        }
      } catch (error) {
        console.error("메시지 처리 중 오류:", error);
      }
    },
    [clearWebViewHistoryByReload, timerCallbacks]
  );

  return {
    handleMessage,
  };
}

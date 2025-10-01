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
  orientation: {
    lockToPortraitUp: () => Promise<void>;
    lockToLandscapeLeft: () => Promise<void>;
    unlockOrientation: () => Promise<void>;
  }
}

export function useWebViewMessage({
  webviewRef,
  timerCallbacks,
  refreshTokenCallback,
  orientation,
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
        console.log("parsedMessage:", parsedMessage);

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

          case WebViewMessageType.LOCK_TO_PORTRAIT_UP:
            orientation.lockToPortraitUp();
            break;

          // case WebViewMessageType.LOCK_TO_LANDSCAPE_LEFT:
          //   console.log("가로모드");
          //   orientation.lockToLandscapeLeft();
          //   break;

          case WebViewMessageType.UNLOCK_ORIENTATION:
            orientation.unlockOrientation();
            console.log("orientation.unlockOrientation!!!!!!!!!!");
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

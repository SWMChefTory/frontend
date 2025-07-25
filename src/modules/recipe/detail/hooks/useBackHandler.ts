import { router } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { WebView } from "react-native-webview";

interface UseBackHandlerProps {
  webviewRef: React.RefObject<WebView | null>;
  canGoBack: boolean;
}

export function useBackHandler({ webviewRef, canGoBack }: UseBackHandlerProps) {
  useEffect(() => {
    const onBackPress = () => {
      if (webviewRef.current && canGoBack) {
        // 웹뷰에서 뒤로갈 수 있는 경우 웹뷰 내부에서 뒤로가기
        webviewRef.current.goBack();
        return true; // 이벤트를 여기서 처리했음을 의미함
      } else {
        // 웹뷰에서 뒤로갈 수 없는 경우 React Native에서 뒤로가기
        router.back();
        return true;
      }
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => backHandlerSubscription.remove();
  }, [webviewRef, canGoBack]);
}

import { Stack, useLocalSearchParams } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Alert, NativeEventEmitter, NativeModules,Linking } from "react-native";
import { useEffect } from "react";

export function useVoiceDeepLink() {
  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      if (url.includes("type=TORY_ALARM_ON")) {
        Alert.alert("토리", "알람 켜 (Intent 딥링크)");
      }
    });

    // 앱이 이미 떠있는 상태에서 open(url)로 들어오면 이걸로 잡힘
    return () => sub.remove();
  }, []);
}

export default function AppLayout() {
  const { setIsWebviewLoaded } = useLocalSearchParams();
  useVoiceDeepLink();

  return (
    <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
          initialParams={{ setIsWebviewLoaded }}
        />
        <Stack.Screen name="settings/settings" />
        <Stack.Screen name="recipe/create" />
      </Stack>
    </KeyboardProvider>
  );
}

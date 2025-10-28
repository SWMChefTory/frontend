import { Stack, useLocalSearchParams } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function AppLayout() {
  const { setIsWebviewLoaded } = useLocalSearchParams();

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

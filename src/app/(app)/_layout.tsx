import { Stack, useLocalSearchParams } from "expo-router";
import { Platform } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const { setIsWebviewLoaded } = useLocalSearchParams();

  return (
    <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
      <SafeAreaSpecificToPlatform>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
            initialParams={{ setIsWebviewLoaded }}
          />
          <Stack.Screen name="settings/settings" />
          <Stack.Screen name="recipe/create" />
        </Stack>
        </SafeAreaSpecificToPlatform>
    </KeyboardProvider>
  );
}

function SafeAreaSpecificToPlatform({
  children,
}: {
  children: React.ReactNode;
}) {
  if (Platform.OS === "ios") {
    return <>{children}</>;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {children}
    </SafeAreaView>
  );
}

import { Stack } from "expo-router";
import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import * as ExpoSplashScreen from "expo-splash-screen";
import { SplashScreen } from "../modules/shared/splash/SplashScreen";

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepareApp() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        console.warn(error);
      }
    }

    prepareApp();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerBackVisible: false,
            headerLeft: () => <CustomBackButton />,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

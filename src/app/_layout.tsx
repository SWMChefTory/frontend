import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalErrorBoundary } from "../modules/shared/components/error/GlobalErrorBoundary";
import { SplashScreenController } from "../modules/shared/splash/SplashScreenController";
import { useFonts, DoHyeon_400Regular } from "@expo-google-fonts/do-hyeon";
import { useEffect } from "react";
import { useAuthBootstrap } from "../modules/user/authBootstrap";

ExpoSplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn, loading } = useAuthBootstrap();
  const [loaded, error] = useFonts({
    DoHyeon_400Regular,
  });

  useEffect(() => {
    if ((loading && loaded) || error) {
      ExpoSplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        headerLeft: () => <CustomBackButton />,
      }}
    >
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true,
      },
      mutations: {
        throwOnError: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <GlobalErrorBoundary>
            <SplashScreenController>
              <RootNavigator />
            </SplashScreenController>
          </GlobalErrorBoundary>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

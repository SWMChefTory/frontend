import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalErrorBoundary } from "../modules/shared/components/error/GlobalErrorBoundary";
import { SplashScreenController } from "../modules/shared/splash/SplashScreenController";
import { useFonts, DoHyeon_400Regular } from "@expo-google-fonts/do-hyeon";
import { useEffect } from "react";
import { useAuthBootstrap } from "../modules/user/authBootstrap";

import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { AppState, AppStateStatus, Platform } from "react-native";
import { focusManager } from "@tanstack/react-query";
import { useDeepLinkHandler } from "@/src/useDeepLink";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";


ExpoSplashScreen.preventAutoHideAsync();

import * as Notifications from "expo-notifications";
import { useNotificationObserver } from "@/src/modules/notifications/useNotificationObserver";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
    },
  },
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

function useAppState(onChange: (status: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onChange);
    return () => {
      subscription.remove();
    };
  }, [onChange]);
}

function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      return onlineManager.setEventListener((setOnline) => {
        const eventSubscription = Network.addNetworkStateListener((state) => {
          setOnline(!!state.isConnected);
        });
        return eventSubscription.remove;
      });
    }
  }, []);
}

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
  useOnlineManager();

  useAppState(onAppStateChange);
  useNotificationObserver();
  useDeepLinkHandler();

  console.log("RootLayout");
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <BottomSheetModalProvider>
            <GlobalErrorBoundary>
              <SplashScreenController>
                <RootNavigator />
              </SplashScreenController>
            </GlobalErrorBoundary>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

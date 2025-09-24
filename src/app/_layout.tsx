import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
  focusManager,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalErrorBoundary } from "../modules/shared/components/error/GlobalErrorBoundary";
import { SplashScreenController } from "../modules/shared/splash/SplashScreenController";
import { useFonts, DoHyeon_400Regular } from "@expo-google-fonts/do-hyeon";
import { useEffect } from "react";
import { useAuthBootstrap } from "../modules/user/authBootstrap";

import * as Network from "expo-network";
import { AppState, AppStateStatus, Platform, View } from "react-native";
import { useDeepLinkHandler } from "@/src/useDeepLink";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  useTheme,
} from "react-native-paper";


import * as Notifications from "expo-notifications";
import { useNotificationObserver } from "@/src/app/(app)/_hooks/useNotificationObserver";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { checkAndApplyUpdates } from "../modules/shared/utils/codepush";
import * as ScreenOrientation from "expo-screen-orientation";

ExpoSplashScreen.preventAutoHideAsync();

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
  const theme = useTheme();

  useEffect(() => {
    if ((loading && loaded) || error) {
      checkAndApplyUpdates();
    }
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        headerLeft: () => <CustomBackButton />,
        headerStyle: {
          backgroundColor: theme.colors.primary, // 헤더 배경색
        },
        contentStyle: {
          backgroundColor: theme.colors.background, // 화면 컨텐츠 배경색
        },
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

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f57c00",
    onPrimary: "#ffffff",
    primaryContainer: "#ffd54f",
    onPrimaryContainer: "#1a1a1a",
    onPrimaryContainerDisabled: "#C7C7C7",
    deEmphasized: "#1a1a1a",
    secondary: "#ff5722",
    surface: "#ffffff",
    background: "#ffffff",
  },

  sizes: {
    button: {
      height: 48, // 공통 높이
      small: {
        paddingHorizontal: 16,
        width: "22%", // 4개 배치용
      },
      medium: {
        paddingHorizontal: 20,
        width: "47%", // 2개 배치용
      },
      large: {
        paddingHorizontal: 24,
        width: "100%", // 1개 배치용
      },
    },
    input: {
      height: 56,
      paddingHorizontal: 16,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  },
};

export default function RootLayout() {
  useOnlineManager();

  useAppState(onAppStateChange);
  useNotificationObserver();
  useDeepLinkHandler();

  useOnlineManager();

  useAppState(onAppStateChange);

  useEffect(() =>  {
    async function changeScreenOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      console.log("ScreenOrientation locked");
    }
    changeScreenOrientation();

  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <PaperProvider theme={theme}>
            <BottomSheetModalProvider>
              <GlobalErrorBoundary>
                <SplashScreenController>
                  <RootNavigator />
                </SplashScreenController>
              </GlobalErrorBoundary>
            </BottomSheetModalProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

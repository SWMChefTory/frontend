import { Stack } from "expo-router";
import {
  AuthProvider,
  useAuth,
} from "@/src/modules/shared/context/auth/AuthContext";
import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreenController } from "../modules/shared/splash/SplashScreenController";
import * as ExpoSplashScreen from "expo-splash-screen";
import { GlobalErrorBoundary } from "../modules/shared/components/error/GlobalErrorBoundary";

ExpoSplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        headerLeft: () => <CustomBackButton />,
      }}
    >
      {/* 인증된 사용자만 접근 가능한 라우트들 */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings/settings"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>

      {/* 인증되지 않은 사용자만 접근 가능한 라우트들 */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/signup"
          options={{
            title: "회원가입",
            headerShown: true,
            headerBackVisible: true,
            headerLeft: undefined,
          }}
        />
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
          <AuthProvider>
            <GlobalErrorBoundary>
              <SplashScreenController>
                <RootNavigator />
              </SplashScreenController>
            </GlobalErrorBoundary>
          </AuthProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

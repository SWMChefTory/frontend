import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/src/context/auth/AuthContext";
import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import * as ExpoSplashScreen from "expo-splash-screen";
import { SplashScreen } from "../modules/shared/splash/SplashScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, ActivityIndicator } from "react-native";

ExpoSplashScreen.preventAutoHideAsync();

function LayoutWithAuth() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [isLoggedIn, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        headerLeft: () => <CustomBackButton />,
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth/signup"
        options={{
          title: "회원가입",
          headerShown: true,
          headerBackVisible: true,
          headerLeft: undefined, // CustomBackButton 대신 기본 백버튼 사용
        }}
      />
      <Stack.Screen
        name="settings/settings"
        options={{
          headerShown: false,  // 커스텀 헤더 사용
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <AuthProvider>
            <LayoutWithAuth />
          </AuthProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
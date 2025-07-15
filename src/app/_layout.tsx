import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/src/context/auth/AuthContext";
import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { View, ActivityIndicator } from "react-native";

function LayoutWithAuth() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
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
          title: '회원가입',
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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AuthProvider>
          <LayoutWithAuth />
        </AuthProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function AuthLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background, // 배경색 추가
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{ headerShown: false, headerBackTitle: "", animation: "none" }}
      />
      <Stack.Screen
        name="signup"
        options={{
          header: () => <OnlyBackTemplate title="" />,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="agreement/ServiceTermsAndConditions"
        options={{
          header: () => <OnlyBackTemplate title="" />,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="agreement/PrivacyTermsAndConditions"
        options={{
          header: () => <OnlyBackTemplate title="" />,
          animation: "none",
        }}
      />
    </Stack>
  );
}

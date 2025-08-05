import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "홈", animation: "none" }} />
      <Stack.Screen name="settings/settings" />
      <Stack.Screen name="recipe/create" />
    </Stack>
  );
}

import { Stack } from "expo-router";


export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings/settings" />
      <Stack.Screen name="recipe/create" />
      {/* <Stack.Screen name="recipe/detail" /> */}
    </Stack>
  );
}
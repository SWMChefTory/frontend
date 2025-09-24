import { Stack} from "expo-router";
import { Platform } from "react-native";

export default function AppLayout() {

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="settings/settings" />
      <Stack.Screen name="recipe/create" />
    </Stack>
  );
}

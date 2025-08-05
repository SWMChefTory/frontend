import { Stack } from "expo-router";

export default function AuthLayout() {
  console.log("AuthLayout");
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "회원가입",
          headerShown: false,
          headerBackVisible: true,
          headerLeft: undefined,
        }}
      />
    </Stack>
  );
}

import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";
import { Stack } from "expo-router";

export default function AuthLayout() {
  console.log("AuthLayout");
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false, headerBackTitle: "",  animation: "none" }}
      />
      <Stack.Screen
        name="signup"
        options={{
          header : () => <OnlyBackTemplate  title="" />,  
          animation: "none",
        }}
      />
      <Stack.Screen
        name="agreement/ServiceTermsAndConditions"
        options={{header: () => <OnlyBackTemplate  title="" />,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="agreement/PrivacyTermsAndConditions"
        options={{header: () => <OnlyBackTemplate  title="" />,
          animation: "none",
        }}
      />
    </Stack>
  );
}

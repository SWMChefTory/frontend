import { useLocalSearchParams } from "expo-router";
import SignupPage from "@/src/pages/signup/SignupPage";
import { useEffect } from "react";

import { track } from "@/src/modules/shared/utils/analytics";

export default function SignupScreen() {
  useEffect(() => {
    track.screen("Signup");
  }, []);
  const { token, provider } = useLocalSearchParams();
  return <SignupPage token={token as string} provider={provider as string} />;
}

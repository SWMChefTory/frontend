import { useLocalSearchParams } from "expo-router";
import { COLORS } from "@/src/modules/shared/constants/colors";
import SignupPage from "@/src/modules/user/presentation/signup/SingupPage";

export default function SignupScreen() {
  const { token, provider } = useLocalSearchParams();
  console.log({
    token,
    provider,
  });
  return <SignupPage token={token as string} provider={provider as string} />;
}

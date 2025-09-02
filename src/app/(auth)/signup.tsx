import { useLocalSearchParams } from "expo-router";
import { GenderOptions } from "@/src/modules/user/presentation/components/GenderOption";
import { Gender } from "@/src/modules/user/enums/Gender";
import { useSignupViewModel } from "@/src/modules/user/business/service/useAuthService";
import {
  makeUTCDateAtMidnight,
  UTCDateAtMidnight,
} from "@/src/modules/shared/utils/UTCDateAtMidnight";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { DateOfBirthPick } from "@/src/modules/user/presentation/components/DateOfBirthPick";
import { NicknameInput } from "@/src/modules/user/presentation/components/NicknameInput";
import { NextButton } from "@/src/modules/user/presentation/components/NextButton";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import SignupPage from "@/src/modules/user/presentation/signup/SingupPage";

export default function SignupScreen() {
  const { token, provider } = useLocalSearchParams();
  console.log({
    token,
    provider,
  });
  return <SignupPage token={token as string} provider={provider as string} />;
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
    backgroundColor: COLORS.background.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.black,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.gray,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },

  inputSection: {
    marginBottom: 40,
    width: "100%",
  },

  birthInputSection: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.black,
    marginBottom: 12,
  },
});

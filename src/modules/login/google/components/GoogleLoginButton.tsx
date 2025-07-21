import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useAuth } from "@/src/modules/shared/context/auth/AuthContext";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ["profile", "email"], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

export default function GoogleLoginButton() {
  const { signin: login } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === "success") {
        const { idToken } = response.data;
        try {
          if (idToken) {
            await login({ provider_token: idToken, provider: "GOOGLE" });
            router.replace("/(tabs)");
          }
        } catch (err) {
          if (err instanceof Error && err.message === "USER_NOT_FOUND") {
            // 회원가입 확인 Alert
            Alert.alert(
              "회원가입",
              "등록되지 않은 사용자입니다. 회원가입을 진행하시겠습니까?",
              [
                { text: "취소", style: "cancel" },
                {
                  text: "가입하기",
                  onPress: () => {
                    // 회원가입 페이지로 이동
                    router.push({
                      pathname: "/auth/signup",
                      params: {
                        token: idToken,
                        provider: "GOOGLE",
                      },
                    });
                  },
                },
              ],
            );
          } else {
            console.error("로그인 에러:", err);
            Alert.alert("오류", "로그인에 실패했습니다.");
          }
        }
      } else {
        console.log("Google Sign-In Error:", response.type);
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  return <GoogleSigninButton onPress={handleSignIn} />;
}

import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useLoginViewModel } from "../../../shared/context/auth/authViewModel";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ["profile", "email"],
  offlineAccess: false,
  forceCodeForRefreshToken: false,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

export default function GoogleLoginButton() {
  const { login, isLoading, error } = useLoginViewModel();
  const router = useRouter();

  const [pendingToken, setPendingToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("error", error);
    if (error instanceof AxiosError && error.response?.data?.errorCode === "USER_1") {
      Alert.alert(
        "회원가입",
        "등록되지 않은 사용자입니다. 회원가입을 진행하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "가입하기",
            onPress: () => {
              router.push({
                pathname: "/auth/signup",
                params: {
                  token: pendingToken,
                  provider: "GOOGLE",
                },
              });
            },
          },
        ],
      );
    }
  }, [error]);

  const handleSignIn = async () => {
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }
      else{
        await GoogleSignin.hasPlayServices();
      }
      const response = await GoogleSignin.signIn();

      if (response.type === "success") {
        const { idToken } = response.data;
        setPendingToken(idToken);
        if (!idToken) {
          console.error("로그인 에러: idToken이 없습니다");
          Alert.alert("오류", "로그인에 실패했습니다.");
          return;
        }

        await login({ id_token: idToken, provider: "GOOGLE" });
        router.replace("/(tabs)");
      } else {
        console.log("Google Sign-In cancelled or failed:", response.type);
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      Alert.alert("오류", "Google 로그인 중 오류가 발생했습니다.");
    }
  };

  return <GoogleSigninButton onPress={handleSignIn} disabled={isLoading} />;
}
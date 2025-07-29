import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useLoginViewModel } from "../../../shared/context/auth/authViewModel";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { OauthProvider } from "@/src/modules/login/enums/OauthProvider";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ["profile", "email"],
  offlineAccess: false,
  forceCodeForRefreshToken: false,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

export default function GoogleLoginButton() {
  const {login, isLoading} = useLoginViewModel();

  const handleSignIn = async () => {
    console.log("로그인 시도");
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("구글 로그안 지나감");
      if (response.type === "success") {
        console.log("로그인 석세스함");
        const { idToken } = response.data;
        console.log("idToken가져옴");
        if (!idToken) {
          console.error("로그인 에러: idToken이 없습니다");
          Alert.alert("오류", "로그인에 실패했습니다.");
          return;
        }

        login({ id_token: idToken, provider: OauthProvider.GOOGLE });
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
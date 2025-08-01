import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { useLoginViewModel } from "../../form/viewmodel/authViewModel";
import { OauthProvider } from "@/src/modules/login/enums/OauthProvider";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ["profile", "email"],
  offlineAccess: false,
  forceCodeForRefreshToken: false,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

export default function GoogleLoginButton() {
  const {login,isLoading} = useLoginViewModel();

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.type === "success") {
        const { idToken } = response.data;
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

  return (
    <>
      {isLoading&&<FullScreenLoader/>}
      <GoogleSigninButton
      onPress={handleSignIn}/>
    </>
  );
}
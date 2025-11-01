import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { useLoginViewModel } from "@/src/modules/user/business/service/useAuthService";
import { OauthProvider } from "@/src/modules/user/enums/OauthProvider";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";
import LoginButtonTemplate from "../../login/LoginButtonTemplate";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ["profile", "email"],
  offlineAccess: false,
  forceCodeForRefreshToken: false,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

export default function GoogleLoginButton({ isReal }: { isReal: boolean }) {
  const { login, isLoading } = useLoginViewModel();

  const handleSignInReal = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("response!!", JSON.stringify(response));
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
      console.log(err);
      Alert.alert("Google Sign-In Error:" + err);
      // Alert.alert("오류", "Google 로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSignInFake = async () => {
    return;
  };

  const handleSignIn = isReal ? handleSignInReal : handleSignInFake;

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <LoginButtonTemplate
        logoPath={require("@/assets/images/googleLogo.png")}
        logoSize={{ width: 22, height: 24 }}
        description="Google로 시작하기"
        handleSignIn={handleSignIn}
      />
    </>
  );
}

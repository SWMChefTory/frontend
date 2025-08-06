import appleAuth, {
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import { useLoginViewModel } from "@/src/modules/user/business/service/useAuthService";
import { OauthProvider } from "@/src/modules/user/enums/OauthProvider";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";
import LoginButtonTemplate from "../../login/LoginButtonTemplate";

export function AppleLoginButton({ isReal }: { isReal: boolean }) {
  const { login, isLoading } = useLoginViewModel();
  const description = "Apple로 시작하기";

  async function handleSignInAppleReal() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (!appleAuthRequestResponse.identityToken) {
      Alert.alert("오류", "Apple 로그인에 실패했습니다.");
      return;
    }

    // use credentialState response to ensure the user is authenticated
    if (
      credentialState === appleAuth.State.AUTHORIZED ||
      credentialState === appleAuth.State.TRANSFERRED
    ) {
      console.log("AppleLoginButton 로그인 성공");
      login({
        id_token: appleAuthRequestResponse.identityToken,
        provider: OauthProvider.APPLE,
      });
      return;
    }

    Alert.alert("오류", "Apple 로그인에 실패했습니다.");
  }
  
  async function handleSignInAppleFake() {
    return;
  }

  const handleSignInApple = isReal ? handleSignInAppleReal : handleSignInAppleFake;

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <LoginButtonTemplate 
      logoPath={require("@/assets/images/appleLogo.png")} 
      logoSize={{width:20, height:24}}
      description={description} 
      handleSignIn={handleSignInApple} />
    </>
  );
}

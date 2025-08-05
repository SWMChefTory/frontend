import appleAuth, {
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import { useLoginViewModel } from "@/src/modules/user/business/service/useAuthService";
import { OauthProvider } from "@/src/modules/user/enums/OauthProvider";
import { Alert } from "react-native";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";

export function AppleLoginButton() {
  const { login, isLoading } = useLoginViewModel();

  async function handleSignInApple() {
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

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: "62%", // You must specify a width
          height: 40, // You must specify a height
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
        onPress={handleSignInApple}
      />
    </>
  );
}

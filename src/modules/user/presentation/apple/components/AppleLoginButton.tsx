import * as AppleAuthentication from 'expo-apple-authentication';
import { useLoginViewModel } from "@/src/modules/user/business/service/useAuthService";
import { OauthProvider } from "@/src/modules/user/enums/OauthProvider";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";
import LoginButtonTemplate from "../../login/LoginButtonTemplate";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";

export function AppleLoginButton({ isReal }: { isReal: boolean }) {
  const { login, isLoading } = useLoginViewModel();
  const description = "Apple로 시작하기";

  async function handleSignInAppleReal() {
    const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        Alert.alert("오류", "이 기기에서는 Apple 로그인을 사용할 수 없습니다.");
        return;
      }

      const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        // nonce/state 필요하면 여기서 넣고 서버에서 검증
      });

      if (!appleAuthRequestResponse.identityToken) {
        Alert.alert("오류", "Apple 로그인에 실패했습니다.");
        return;
      }

      const credentialState = await AppleAuthentication.getCredentialStateAsync(appleAuthRequestResponse.user);


    // use credentialState response to ensure the user is authenticated
    if (
      credentialState === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED ||
      credentialState === AppleAuthentication.AppleAuthenticationCredentialState.TRANSFERRED
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
      logoSize={{width:responsiveWidth(20), height:responsiveHeight(24)}}
      description={description} 
      handleSignIn={handleSignInApple} />
    </>
  );
}

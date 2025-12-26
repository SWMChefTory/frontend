import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Image, ImageSource } from "expo-image";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { useLoginViewModel } from "@/src/modules/user/business/service/useAuthService";
import * as AppleAuthentication from "expo-apple-authentication";
import { OauthProvider } from "@/src/modules/user/enums/OauthProvider";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AxiosError } from "axios";
import { create } from "zustand";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import TermsAndConditionsModalContent from "@/src/pages/login/ui/TermsAndConditionsModalContent";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Market } from "@/src/modules/shared/types/market";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ["profile", "email"],
  offlineAccess: false,
  forceCodeForRefreshToken: false,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

/**
 * 로그인 버튼 텍스트 관리
 * Market별 버튼 텍스트를 한 곳에서 관리
 */
const BUTTON_TEXT = {
  KOREA: {
    google: "Google로 시작하기",
    apple: "Apple로 시작하기",
  },
  GLOBAL: {
    google: "Start with Google",
    apple: "Start with Apple",
  },
} as const;

export function GoogleLoginButton({ market }: { market: Market }) {
  const { handleSignInGoogle, isLoading } = useLoginWithGoogle();
  const description = BUTTON_TEXT[market].google;

  console.log("isLoading!!!", isLoading);

  return (
    <>
      <LoginButtonTemplate
        logoPath={require("@/assets/images/googleLogo.png")}
        logoSize={{ width: 22, height: 24 }}
        description={description}
        handleSignIn={handleSignInGoogle}
      />
    </>
  );
}

export function AppleLoginButton({ market }: { market: Market }) {
  const { handleSignInApple } = useLoginWithApple();
  const description = BUTTON_TEXT[market].apple;

  return (
    <>
      <LoginButtonTemplate
        logoPath={require("@/assets/images/appleLogo.png")}
        logoSize={{ width: responsiveWidth(20), height: responsiveHeight(24) }}
        description={description}
        handleSignIn={handleSignInApple}
      />
    </>
  );
}

function useLoginWithGoogle() {
  const { login, isLoading, error } = useLoginViewModel();
  console.log("isLoading!!", isLoading);
  console.log("error!!", error);
  const { openModal } = useSignupModalStore();
  const [idToken, setIdToken] = useState<string | null>(null);
  async function handleSignInGoogle() {
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
        setIdToken(idToken);
        login({ id_token: idToken, provider: OauthProvider.GOOGLE });
      } else {
        console.log("구글에 문제가 생겼습니다.", response.type);
        Alert.alert("구글에 문제가 생겼습니다.", response.type);
      }
    } catch (err) {
      console.error("서버에 문제가 있습니다." + err);
      Alert.alert("서버에 문제가 있습니다." + err);
    }
  }

  useEffect(() => {
    if (isNotUserError(error) && idToken) {
      setTimeout(() => {
        console.log("open modal!!", idToken);
        openModal({ idToken: idToken, provider: OauthProvider.GOOGLE });
      }, 500);
    }
  }, [error, idToken]);

  return { handleSignInGoogle, isLoading };
}

type SignupModalStore = {
  idToken: string | null;
  provider: OauthProvider | null;
  isOpen: boolean;
  openModal: ({
    idToken,
    provider,
  }: {
    idToken: string;
    provider: OauthProvider;
  }) => void;
  closeModal: () => void;
};

export const useSignupModalStore = create<SignupModalStore>((set) => ({
  idToken: null,
  provider: null,
  isOpen: false,
  openModal: ({
    idToken,
    provider,
  }: {
    idToken: string;
    provider: OauthProvider;
  }) => {
    set({ idToken: idToken, provider: provider });
    set({ isOpen: true });
  },
  closeModal: () => {
    set({ idToken: null, provider: null });
    set({ isOpen: false });
  },
}));

function isNotUserError(error: any) {
  if (
    error instanceof AxiosError &&
    error.response?.data?.errorCode === "USER_001"
  ) {
    return true;
  }
  return false;
}

function useLoginWithApple() {
  const { login, isLoading, error } = useLoginViewModel();
  const { openModal } = useSignupModalStore();
  const [idToken, setIdToken] = useState<string | null>(null);

  async function handleSignInApple() {
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

    const credentialState = await AppleAuthentication.getCredentialStateAsync(
      appleAuthRequestResponse.user,
    );
    // use credentialState response to ensure the user is authenticated
    if (
      credentialState ===
        AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED ||
      credentialState ===
        AppleAuthentication.AppleAuthenticationCredentialState.TRANSFERRED
    ) {
      console.log("AppleLoginButton 로그인 성공");
      login({
        id_token: appleAuthRequestResponse.identityToken,
        provider: OauthProvider.APPLE,
      });
      setIdToken(appleAuthRequestResponse.identityToken);
      return;
    }
    Alert.alert("오류", "Apple 로그인에 실패했습니다.");
  }

  useEffect(() => {
    if (isNotUserError(error) && idToken) {
      openModal({
        idToken: idToken,
        provider: OauthProvider.APPLE,
      });
    }
  }, [error, idToken]);

  return { handleSignInApple, isLoading };
}

function LoginButtonTemplate({
  description,
  logoPath,
  logoSize,
  handleSignIn,
}: {
  description: string;
  logoPath: ImageSource;
  logoSize: { width: number; height: number };
  handleSignIn: () => Promise<void>;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
      <View style={styles.buttonContent}>
        <View style={styles.iconContainer}>
          <Image
            source={logoPath}
            style={{
              height: logoSize.height,
              aspectRatio: 1,
              resizeMode: "contain",
            }}
          />
        </View>
        <Text style={styles.buttonText}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: responsiveWidth(250),
    height: responsiveHeight(50),
    backgroundColor: COLORS.background.white,
    borderRadius: responsiveWidth(8),
    ...SHADOW,
    justifyContent: "center",
  },
  buttonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(16),
  },
  iconContainer: {
    marginRight: responsiveWidth(16),
  },
  buttonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: "700",
    color: COLORS.text.gray,
    fontFamily: "NotoSerifKR_400Regular",
  },
});

export function TermsAndConditionsModal() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { idToken, provider, closeModal } = useSignupModalStore();

  useEffect(() => {
    if (idToken && provider) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [idToken, provider]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      pressBehavior="close"
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      onPress={() => {
        closeModal();
      }}
    />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      keyboardBehavior="extend"
      // snapPoints={["70%"]}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      enableDynamicSizing={true}
      animateOnMount={false}
    >
      <TermsAndConditionsModalContent />
    </BottomSheetModal>
  );
}

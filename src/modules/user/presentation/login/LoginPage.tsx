import { View, Text, StyleSheet, Alert } from "react-native";
import GoogleLoginButton from "@/src/modules/user/presentation/google/components/GoogleLoginButton";
import { AppleLoginButton } from "@/src/modules/user/presentation/apple/components/AppleLoginButton";
import { Image } from "expo-image";
import { COLORS } from "@/src/modules/shared/constants/colors";
import logoStyle from "@/src/modules/shared/splash/logo/style/logostyle";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";
import { useEffect } from "react";
import { client } from "@/src/modules/shared/api/client";

Image.prefetch("@/assets/images/mainCharacter.png", "disk");
Image.prefetch("@/assets/images/voiceNear.png", "disk");
Image.prefetch("@/assets/images/voiceFar.png", "disk");
Image.prefetch("@/assets/images/mainText.png", "disk");
Image.prefetch("@/assets/images/mainText-en.png", "disk");

export default function LoginPage({ isReal }: { isReal: boolean }) {
  useEffect(() => {
    client
      .get("/server-message")
      .then((res) => {
        Alert.alert(res.data.message);
      })
      .catch((err) => {
        // nothing
      });
  }, []);

  const banner = (
    <View
      style={{
        transform: [{ scale: 0.8 }],
        zIndex: 1,
      }}
    >
      <Image
        source={require("@/assets/images/mainCharacter.png")}
        style={logoStyle.logoLogin}
      />
      <Image
        source={require("@/assets/images/voiceNear.png")}
        style={logoStyle.voiceNearLogin}
      />
      <Image
        source={require("@/assets/images/voiceFar.png")}
        style={logoStyle.voiceFarLogin}
      />
      <Image
        source={require("@/assets/images/mainText.png")}
        style={logoStyle.cheftoryLogin}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {banner}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.subTitle}>
            지금 쉐프토리와 요리를 시작해보세요
          </Text>
        </View>
        <View style={styles.buttonCotainer}>
          <GoogleLoginButton isReal={isReal} />
        </View>
        <AppleLoginButton isReal={isReal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(24),
    backgroundColor: COLORS.primary.main,
  },
  logoContainer: {
    width: responsiveWidth(150),
    height: responsiveWidth(150),
    marginBottom: responsiveHeight(32),
    marginRight: responsiveWidth(20),
  },
  titleContainer: {
    marginTop: responsiveHeight(180),
    alignItems: "center",
  },
  logo: {
    width: responsiveWidth(150),
    height: responsiveWidth(150),
  },
  title: {
    width: responsiveWidth(156),
    height: responsiveHeight(40),
    fontFamily: "NotoSerifKR_700Bold",
    fontSize: responsiveFontSize(42),
    marginBottom: 22,
    fontWeight: "bold",
  },
  subTitle: {
    color: COLORS.font.dark,
    fontSize: responsiveFontSize(16),
    marginBottom: responsiveHeight(32),
    fontWeight: "bold",
  },
  buttonCotainer: {
    paddingBottom: responsiveHeight(10),
  },
});

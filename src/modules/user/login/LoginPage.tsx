import { View, Text, StyleSheet } from "react-native";
import GoogleLoginButton from "@/src/modules/user/presentation/google/components/GoogleLoginButton";
import { AppleLoginButton } from "@/src/modules/user/presentation/apple/components/AppleLoginButton";
import { Image } from "expo-image";
import { COLORS } from "../../../shared/constants/colors";
import { useLogoStore } from "../../../shared/splash/logo/LogoStore";
import logoStyle from "@/src/modules/shared/splash/logo/logostyle";
import React from "react";

export default function LoginPage({ isReal }: { isReal: boolean }) {
  const { logo } = useLogoStore();
  const logoLogin = logoStyle.logoLogin;

  return (
    <View style={styles.container}>
      {logo}
      {/*   */}
      <View style={styles.titleContainer}>
        {/* <Text style={styles.title}>셰프토리</Text> */}
        <Image source={require("@/assets/images/cheftory.png")} style={styles.title} />
        <Text style={styles.subTitle}>지금 셰프토리와 요리를 시작해보세요</Text>
      </View>
      <View style={styles.buttonCotainer}>
        <GoogleLoginButton isReal={isReal} />
      </View>
      <AppleLoginButton isReal={isReal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.priamry.main,
  },
  logoContainer:{
    width: 150,
    height: 150,
    marginBottom: 32,
    marginRight: 20,
  },
  titleContainer:{
    marginTop: 180,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    width: 156,
    height: 40,
    fontFamily: "NotoSerifKR_700Bold",
    fontSize: 42,
    marginBottom: 22,
    fontWeight: "bold",
  },
  subTitle: {
    // fontFamily: "NotoSerifKR_400Regular",
    color: COLORS.font.dark,
    fontSize: 16,
    marginBottom: 32,
    fontWeight: "bold",
  },
  buttonCotainer: {
    paddingBottom: 10,
  },
});

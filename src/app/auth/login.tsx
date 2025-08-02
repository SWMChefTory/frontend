import { View, Text, StyleSheet } from "react-native";
import GoogleLoginButton from "@/src/modules/user/google/components/GoogleLoginButton";
import { AppleLoginButton } from "@/src/modules/user/apple/components/AppleLoginButton";
import { Image } from "expo-image";
import { COLORS } from "@/src/modules/shared/constants/colors";

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={{width: 150, height: 150}}/>
      <Text style={styles.title}>셰프토리</Text>
      <Text style={styles.subTitle}>셰프토리에 로그인 하세요.</Text>
      <View style={styles.buttonCotainer}>
        <GoogleLoginButton />
      </View>
      <AppleLoginButton />
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
  title: {
    fontFamily: "NotoSerifKR_700Bold",
    fontSize: 42,
    marginBottom: 22,
    fontWeight: "bold",
  },
  subTitle: {
    fontFamily: "NotoSerifKR_400Regular",
    fontSize: 16,
    marginBottom: 32,
    fontWeight: "bold",
  },
  buttonCotainer: {
    paddingBottom: 10,
  }
});

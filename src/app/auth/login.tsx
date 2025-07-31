import { View, Text, StyleSheet } from "react-native";
import GoogleLoginButton from "@/src/modules/login/google/components/GoogleLoginButton";
import { AppleLoginButton } from "@/src/modules/login/apple/components/AppleLoginButton";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cheftory에 로그인하세요</Text>
      <GoogleLoginButton />
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 32,
    fontWeight: "bold",
  },
});

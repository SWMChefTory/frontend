import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import {
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import {
  AppleButton,
} from "@invertase/react-native-apple-authentication";

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/mainCharacter.png")}
        style={{ width: 150, height: 150 }}
      />
      <Text style={styles.title}>셰프토리</Text>
      <Text style={styles.subTitle}>셰프토리에 로그인 하세요.</Text>
      {/* <View style={styles.buttonCotainer}>
        <GoogleSigninButton onPress={() => {}} />
      </View>
      <AppleButton onPress={() => {}} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
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
  },
});

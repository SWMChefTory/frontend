import { View, Text, StyleSheet } from "react-native";
import GoogleLoginButton from "@/src/modules/user/presentation/google/components/GoogleLoginButton";
import { AppleLoginButton } from "@/src/modules/user/presentation/apple/components/AppleLoginButton";
import { Image } from "expo-image";
import { COLORS } from "../../../shared/constants/colors";
import logoStyle from "../../../shared/splash/logo/style/logostyle";
import { Asset } from "expo-asset";
 

Image.prefetch('@/assets/images/mainCharacter.png', 'disk');
Image.prefetch('@/assets/images/voiceNear.png', 'disk');
Image.prefetch('@/assets/images/voiceFar.png', 'disk');
Image.prefetch('@/assets/images/mainText', 'disk');

export default function LoginPage({ isReal }: { isReal: boolean }) {
  const logoAsset = Asset.fromModule(require('@/assets/images/mainCharacter.png'));
  const voiceNearAsset = Asset.fromModule(require('@/assets/images/voiceNear.png'));
  const voiceFarAsset = Asset.fromModule(require('@/assets/images/voiceFar.png'));
  const cheftoryAsset = Asset.fromModule(require('@/assets/images/mainText.png'));

  const animatedLogoMain = (
    <Image 
      source={{ uri: logoAsset.uri }} 
      style={logoStyle.logoLogin} 
    />
  );
  const animatedVoiceNear = (
    <Image 
      source={{ uri: voiceNearAsset.uri }} 
      style={logoStyle.voiceNearLogin} 
    />
  );
  const animatedVoiceFar = (
    <Image 
      source={{ uri: voiceFarAsset.uri }} 
      style={logoStyle.voiceFarLogin} 
    />
  );

  const cheftory = (
    <Image
      source={{ uri: cheftoryAsset.uri }} 
      style={logoStyle.cheftoryLogin}
    />
  );

  const banner = (
    <View style={{
      transform: [{ scale: 0.8 }], 
      zIndex: 1,
    }}>
      {animatedLogoMain}
      {animatedVoiceNear}
      {animatedVoiceFar}
      {cheftory}
    </View>
  );

  return (
    <View style={{flex: 1}}>
      {banner}
      <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.subTitle}>지금 셰프토리와 요리를 시작해보세요</Text>
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
    color: COLORS.font.dark,
    fontSize: 16,
    marginBottom: 32,
    fontWeight: "bold",
  },
  buttonCotainer: {
    paddingBottom: 10,
  },
});

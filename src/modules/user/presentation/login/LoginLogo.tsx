import { Asset } from "expo-asset";
import { View } from "react-native";
import logoStyle from "../../../shared/splash/logo/style/logostyle";
import { Image } from "expo-image";

export function LoginLogo() {

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
      style={logoStyle.cheftoryLogin} // 애니메이션 스타일 직접 적용
    />
  );

  const banner = (
    <View style={{
      transform: [{ scale: 0.8 }], // 고정값 OK
      // transform: [{ rotate: '45deg' }], // 이것도 OK
      // transform: [{ translateX: 50 }], // 이것도 OK
      zIndex: 1,
      // position: 'absolute',
    }}>
      {animatedLogoMain}
      {animatedVoiceNear}
      {animatedVoiceFar}
      {cheftory}
    </View>
  );
  
  return banner;          
}
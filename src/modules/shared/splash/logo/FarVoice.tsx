import { Image } from "expo-image";
import Animated, { FadeIn, FadeOut, SharedValue, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import logoStyle from "./style/logostyle";
import { useEffect } from "react";

function FarVoice({translateY, fadeStart, fadeDuration,}: {translateY: SharedValue<number>, fadeStart: number, fadeDuration: number}) {
  const translateFarOpacity = useSharedValue(0);
  const voiceFarAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.voiceFar,
      transform: [{ translateY: translateY.value }],  
      opacity: translateFarOpacity.value,
    };
  });

  useEffect(() => {
    translateFarOpacity.value = withDelay(fadeStart, withTiming(1, { duration: fadeDuration }));
  }, []);

  return (
    <Animated.Image
      source={require("@/assets/images/voiceFar.png")} 
      style={voiceFarAnimatedStyle} 
    />
  );
}

export default FarVoice;
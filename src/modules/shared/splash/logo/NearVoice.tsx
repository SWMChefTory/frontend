import { Image } from "expo-image";
import Animated, {
  FadeIn,
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import logoStyle from "./style/logostyle";
import { useEffect } from "react";

function NearVoice({
  translateY,
  fadeStart,
  fadeDuration,
}: {
  translateY: SharedValue<number>;
  fadeStart: number;
  fadeDuration: number;
}) {
  const translateNearOpacity = useSharedValue(0);
  useEffect(() => {
    translateNearOpacity.value = withDelay(
      fadeStart,
      withTiming(1, { duration: fadeDuration }),
    );
  }, []);
  const voiceNearAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.voiceNear,
      transform: [{ translateY: translateY.value }],
      opacity: translateNearOpacity.value,
    };
  });

  const animatedVoiceNear = (
    <Animated.Image
      entering={FadeIn.delay(fadeStart).duration(fadeDuration)}
      source={require("@/assets/images/voiceNear.png")}
      style={voiceNearAnimatedStyle}
    />
  );
  return animatedVoiceNear;
}

export default NearVoice;

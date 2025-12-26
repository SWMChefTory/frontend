import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import logoStyle from "./style/logostyle";
import { useEffect } from "react";
import type { Market } from "@/src/modules/shared/types/market";

function MainText({
  translateY,
  fadeStart,
  fadeDuration,
  market,
}: {
  translateY: SharedValue<number>;
  fadeStart: number;
  fadeDuration: number;
  market: Market | null;
}) {
  const cheftoryOpacity = useSharedValue(0);
  useEffect(() => {
    cheftoryOpacity.value = withDelay(
      fadeStart,
      withTiming(1, { duration: fadeDuration }),
    );
  }, []);
  const cheftoryAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.cheftory,
      transform: [{ translateY: translateY.value }],
      opacity: cheftoryOpacity.value,
    };
  });

  // GLOBAL 사용자는 영문 로고, 그 외(KOREA 또는 null)는 한글 로고
  const imageSource =
    market === "GLOBAL"
      ? require("@/assets/images/mainText-en.png")
      : require("@/assets/images/mainText.png");

  return <Animated.Image source={imageSource} style={cheftoryAnimatedStyle} />;
}

export default MainText;

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
import { getMarketLogo } from "@/src/modules/shared/constants/marketAssets";

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

  // market에 따라 기본 스타일 선택
  const baseStyle =
    market === "GLOBAL" ? logoStyle.cheftoryEn : logoStyle.cheftory;

  const cheftoryAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...baseStyle,
      transform: [{ translateY: translateY.value }],
      opacity: cheftoryOpacity.value,
    };
  });

  // Market에 따른 로고 이미지 (중앙 관리)
  const imageSource = getMarketLogo(market);

  return <Animated.Image source={imageSource} style={cheftoryAnimatedStyle} />;
}

export default MainText;

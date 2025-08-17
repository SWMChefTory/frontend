import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { SharedValue } from "react-native-reanimated";
import logoStyle from "./style/logostyle";
import { useEffect } from "react";

function MainText({translateY, fadeStart, fadeDuration}: {translateY: SharedValue<number>, fadeStart:number, fadeDuration:number}) {
  const cheftoryOpacity = useSharedValue(0);
  useEffect(() => {
    cheftoryOpacity.value = withDelay(fadeStart, withTiming(1, { duration: fadeDuration }));
  }, []);
  const cheftoryAnimatedStyle = useAnimatedStyle(() => {
  return {
      ...logoStyle.cheftory,
      transform: [{ translateY: translateY.value }],
      opacity: cheftoryOpacity.value,
    };
  });

  return (
    <Animated.Image 
        source={require("@/assets/images/mainText.png")} 
        style={cheftoryAnimatedStyle}
      />
  )
}

export default MainText;
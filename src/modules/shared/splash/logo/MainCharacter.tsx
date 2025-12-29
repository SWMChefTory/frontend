import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import logoStyle from "./style/logostyle";

function MainCharacter({ translateY }: { translateY: SharedValue<number> }) {
  const logoMainAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.logoCenter, // 스타일시트 적용
      transform: [{ translateY: translateY.value }],
      //   width: 170,
      //   height: 160,
    };
  });
  const animatedLogoMain = (
    <Animated.Image
      source={require("@/assets/images/mainCharacter.png")}
      style={logoMainAnimatedStyle}
    />
  );

  return animatedLogoMain;
}

export default MainCharacter;

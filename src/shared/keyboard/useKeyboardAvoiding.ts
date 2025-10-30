import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const useGradualAnimation = () => {
  const height = useSharedValue(0);
  useKeyboardHandler(
    {
      onMove: (event) => {
        "worklet";
        height.value = Math.max(event.height, 0);
      },
    },
    []
  );
  return {
    height,
  };
};

export const useKeyboardAvoidingAnimation = () => {
  const { height: keyboardHeight } = useGradualAnimation();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboardHeight.value,
    };
  });
  return {
    animatedStyle,
  };
};

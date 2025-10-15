import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  const { height: keyboardHeight } = useGradualAnimation();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboardHeight.value + insets.bottom }],
    };
  });
  return {
    animatedStyle,
  };
};

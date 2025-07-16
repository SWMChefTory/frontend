import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

export function useRecipeCreateAnimation() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const reverseSpinValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 회전 애니메이션
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // 역방향 회전 애니메이션
    const reverseSpinAnimation = Animated.loop(
      Animated.timing(reverseSpinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // 바운스 애니메이션
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 750,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    // 스케일 애니메이션
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    spinAnimation.start();
    reverseSpinAnimation.start();
    bounceAnimation.start();
    scaleAnimation.start();

    return () => {
      spinAnimation.stop();
      reverseSpinAnimation.stop();
      bounceAnimation.stop();
      scaleAnimation.stop();
    };
  }, [spinValue, reverseSpinValue, bounceValue, scaleValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const reverseSpin = reverseSpinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const bounce = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return {
    spin,
    reverseSpin,
    bounce,
    scaleValue,
  };
}

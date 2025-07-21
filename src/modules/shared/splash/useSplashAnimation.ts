import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function useSplashAnimation(onFinish: () => void) {
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const gradientOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const yellowDot = useRef(new Animated.Value(0)).current;
  const greenDot = useRef(new Animated.Value(0)).current;
  const yellowFloat = useRef(new Animated.Value(1)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(gradientOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(logoTranslateY, {
          toValue: -60,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(yellowDot, {
          toValue: 1,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(greenDot, {
          toValue: 1,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    sequence.start((finished) => {
      if (finished) {
        const bounce = (val: Animated.Value, dly: number) =>
          Animated.loop(
            Animated.sequence([
              Animated.timing(val, {
                toValue: -8,
                duration: 400,
                delay: dly,
                useNativeDriver: true,
              }),
              Animated.timing(val, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          );
        bounce(dot1, 0).start();
        bounce(dot2, 150).start();
        bounce(dot3, 300).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(yellowFloat, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(yellowFloat, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ).start();

        setTimeout(onFinish, 2000);
      }
    });

    const fallback = setTimeout(onFinish, 5000);
    return () => clearTimeout(fallback);
  }, []);

  return {
    gradientOpacity,
    logoTranslateY,
    logoScale,
    logoOpacity,
    yellowDot,
    greenDot,
    yellowFloat,
    titleOpacity,
    subtitleOpacity,
    dotsOpacity,
    dot1,
    dot2,
    dot3,
  };
}

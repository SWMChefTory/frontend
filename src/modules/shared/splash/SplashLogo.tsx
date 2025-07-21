import { View, Animated, Image, StyleSheet, Platform } from "react-native";
import { SPLASH_CONFIG } from "./SplashConfig";

export default function SplashLogo({
  translateY,
  scale,
  opacity,
  yellowDot,
  greenDot,
  yellowFloat,
}: {
  translateY: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  yellowDot: Animated.Value;
  greenDot: Animated.Value;
  yellowFloat: Animated.Value;
}) {
  return (
    <Animated.View
      style={[styles.logoContainer, { transform: [{ translateY }] }]}
    >
      <Animated.View
        style={[styles.logoWrapper, { opacity, transform: [{ scale }] }]}
      >
        <View style={styles.logoBox}>
          <Image
            source={require("@/assets/images/splash2.png")}
            style={styles.logoImage}
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.yellowDot,
          {
            opacity: yellowDot,
            transform: [{ scale: Animated.multiply(yellowDot, yellowFloat) }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.greenDot,
          { opacity: greenDot, transform: [{ scale: greenDot }] },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logoContainer: { position: "absolute" },
  logoWrapper: { position: "relative" },
  logoBox: {
    width: SPLASH_CONFIG.dimensions.logo.container.width,
    height: SPLASH_CONFIG.dimensions.logo.container.height,
    borderRadius: SPLASH_CONFIG.dimensions.logo.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        backgroundColor: SPLASH_CONFIG.colors.shadow.ios,
        ...SPLASH_CONFIG.shadow.ios,
      },
      android: {
        backgroundColor: SPLASH_CONFIG.colors.shadow.android,
        ...SPLASH_CONFIG.shadow.android,
      },
    }),
  },
  yellowDot: {
    position: "absolute",
    top: SPLASH_CONFIG.dimensions.positioning.yellowDotPosition.top,
    right: SPLASH_CONFIG.dimensions.positioning.yellowDotPosition.right,
    width: SPLASH_CONFIG.dimensions.dots.yellow.width,
    height: SPLASH_CONFIG.dimensions.dots.yellow.height,
    backgroundColor: SPLASH_CONFIG.colors.yellowDot,
    borderRadius: SPLASH_CONFIG.dimensions.dots.yellow.borderRadius,
  },
  greenDot: {
    position: "absolute",
    bottom: SPLASH_CONFIG.dimensions.positioning.greenDotPosition.bottom,
    left: SPLASH_CONFIG.dimensions.positioning.greenDotPosition.left,
    width: SPLASH_CONFIG.dimensions.dots.green.width,
    height: SPLASH_CONFIG.dimensions.dots.green.height,
    backgroundColor: SPLASH_CONFIG.colors.greenDot,
    borderRadius: SPLASH_CONFIG.dimensions.dots.green.borderRadius,
  },
  logoImage: {
    width: SPLASH_CONFIG.dimensions.logo.image.width,
    height: SPLASH_CONFIG.dimensions.logo.image.height,
  },
});

import { View, Animated, StyleSheet } from "react-native";
import { SPLASH_CONFIG } from "./SplashConfig";

export default function SplashTextSection({
  titleOpacity,
  subtitleOpacity,
  dotsOpacity,
  dot1,
  dot2,
  dot3,
  title,
  subtitle,
}: {
  titleOpacity: Animated.Value;
  subtitleOpacity: Animated.Value;
  dotsOpacity: Animated.Value;
  dot1: Animated.Value;
  dot2: Animated.Value;
  dot3: Animated.Value;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.textSection}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        {title}
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        {subtitle}
      </Animated.Text>
      <Animated.View style={[styles.dotsContainer, { opacity: dotsOpacity }]}>
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  textSection: {
    marginTop: SPLASH_CONFIG.dimensions.positioning.textMarginTop,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: SPLASH_CONFIG.colors.text.primary,
    marginBottom: 16,
    ...SPLASH_CONFIG.textShadow,
  },
  subtitle: {
    fontSize: 16,
    color: SPLASH_CONFIG.colors.text.secondary,
    marginBottom: 48,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: SPLASH_CONFIG.dimensions.dots.loading.width,
    height: SPLASH_CONFIG.dimensions.dots.loading.height,
    backgroundColor: SPLASH_CONFIG.colors.text.dots,
    borderRadius: SPLASH_CONFIG.dimensions.dots.loading.borderRadius,
    marginHorizontal: 4,
  },
});

import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SPLASH_CONFIG } from "./SplashConfig";

export default function SplashBackground({
  gradientOpacity,
}: {
  gradientOpacity: Animated.Value;
}) {
  return (
    <>
      <View style={styles.solidBackground} />
      <Animated.View
        style={[styles.gradientContainer, { opacity: gradientOpacity }]}
      >
        <LinearGradient
          colors={SPLASH_CONFIG.colors.gradients}
          style={styles.gradient}
          start={SPLASH_CONFIG.gradient.start}
          end={SPLASH_CONFIG.gradient.end}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  solidBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: SPLASH_CONFIG.colors.background,
  },
  gradientContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  gradient: { flex: 1 },
});

import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  icon: string;
  colors: readonly [string, string];
  spin: Animated.AnimatedAddition<string>;
  reverseSpin: Animated.AnimatedAddition<string>;
  bounce: Animated.AnimatedAddition<number>;
  scaleValue: Animated.Value;
}

export function LoadingAnimation({
  icon,
  colors,
  spin,
  reverseSpin,
  bounce,
  scaleValue,
}: Props) {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingWrapper}>
        {/* 외부 회전 링 */}
        <View style={styles.outerRingBase} />
        <Animated.View
          style={[
            styles.outerRing,
            {
              transform: [{ rotate: spin }],
              borderTopColor: colors[0],
              borderRightColor: colors[1],
            },
          ]}
        />

        {/* 내부 회전 링 */}
        <Animated.View
          style={[
            styles.innerRing,
            {
              transform: [{ rotate: reverseSpin }],
              borderBottomColor: colors[0],
            },
          ]}
        />

        {/* 중앙 아이콘 */}
        <LinearGradient colors={colors} style={styles.iconContainer}>
          <Animated.Text
            style={[
              styles.iconText,
              {
                transform: [{ translateY: bounce }, { scale: scaleValue }],
              },
            ]}
          >
            {icon}
          </Animated.Text>
        </LinearGradient>

        {/* 플로팅 파티클들 */}
        <Animated.View
          style={[styles.particle1, { transform: [{ scale: scaleValue }] }]}
        />
        <Animated.View
          style={[styles.particle2, { transform: [{ scale: scaleValue }] }]}
        />
        <Animated.View
          style={[styles.particle3, { transform: [{ translateY: bounce }] }]}
        />
        <Animated.View
          style={[styles.particle4, { transform: [{ scale: scaleValue }] }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    marginBottom: 32,
  },
  loadingWrapper: {
    width: 160,
    height: 160,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  outerRingBase: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#E2E8F0",
  },
  outerRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "transparent",
  },
  innerRing: {
    position: "absolute",
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  iconText: {
    fontSize: 48,
    textAlign: "center",
  },
  particle1: {
    position: "absolute",
    top: -12,
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FDE047",
  },
  particle2: {
    position: "absolute",
    bottom: -12,
    left: -12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4ADE80",
  },
  particle3: {
    position: "absolute",
    top: "50%",
    left: -24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F472B6",
  },
  particle4: {
    position: "absolute",
    top: "25%",
    right: -16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#60A5FA",
  },
});

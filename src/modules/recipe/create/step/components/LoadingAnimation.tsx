import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageSourcePropType } from "react-native";

interface Props {
  image: string;
  colors: readonly [string, string];
  spin: Animated.AnimatedAddition<string>;
  reverseSpin: Animated.AnimatedAddition<string>;
  bounce: Animated.AnimatedAddition<number>;
  scaleValue: Animated.Value;
}

export function LoadingAnimation({
  image,
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
        {/* <View style={styles.outerRingBase} />
        <Animated.View
          style={[
            styles.outerRing,
            {
              transform: [{ rotate: spin }],
              borderTopColor: colors[0],
              borderRightColor: colors[1],
              borderBottomColor: "#E2E8F0",
              borderLeftColor: "#E2E8F0",
            },
          ]}
        /> */}

        {/* 내부 회전 링 */}
        <Animated.View
          style={[
            styles.innerRing,
            {
              transform: [{ rotate: reverseSpin }],
              borderBottomColor: colors[0],
              borderTopColor: "#E2E8F0",
              borderLeftColor: "#E2E8F0",
              borderRightColor: "#E2E8F0",
            },
          ]}
        />

        {/* 중앙 아이콘 */}
        <View style={styles.iconContainer}>
        <Animated.View
          style={{
            transform: [{ translateY: bounce }, { scale: scaleValue }],
          }}
        >
          <Image
            source={image as ImageSourcePropType}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
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
    paddingBottom: 32,
  },
  loadingWrapper: {
    width: 168,
    height: 168,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  outerRingBase: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: "#F5F5F5", // 연한 회색 베이스
  },
  outerRing: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 4,
  },
  innerRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 170,
    height: 170,
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

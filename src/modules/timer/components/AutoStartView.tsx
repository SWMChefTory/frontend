import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface AutoStartViewProps {
  secondsLeft: number;
  onStartNow: () => void;
  onCancel: () => void;
}

export function AutoStartView({
  secondsLeft,
  onStartNow,
  onCancel,
}: AutoStartViewProps) {
  const progress = useSharedValue(0);
  const countdownScale = useSharedValue(1);

  useEffect(() => {
    const progressValue = (10 - secondsLeft) / 10;
    progress.value = withTiming(progressValue, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [secondsLeft, progress]);

  useEffect(() => {
    countdownScale.value = withTiming(1.1, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });

    const timeout = setTimeout(() => {
      countdownScale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [secondsLeft, countdownScale]);

  const progressBarStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [0, 100]);
    return {
      width: `${width}%`,
    };
  });

  const progressTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  const countdownStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: countdownScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            타이머가 {secondsLeft}초 후 자동 시작됩니다
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressBarStyle]} />
          </View>
          <Animated.Text style={[styles.progressText, progressTextStyle]}>
            {Math.round(((10 - secondsLeft) / 10) * 100)}%
          </Animated.Text>
        </View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.startButton]}
          onPress={onStartNow}
        >
          <Text style={styles.startButtonText}>지금 시작</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.priamry.cook,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  mainText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.black,
    textAlign: "center",
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: COLORS.text.black,
    textAlign: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border.lightGray,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.orange.main,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.text.black,
    fontWeight: "500",
    minWidth: 35,
    textAlign: "right",
  },
  countdownContainer: {
    alignItems: "center",
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: COLORS.orange.main,
    lineHeight: 52,
  },
  countdownLabel: {
    fontSize: 14,
    color: COLORS.text.gray,
    fontWeight: "500",
    marginTop: -4,
  },
  bottomButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 12,
    backgroundColor: COLORS.priamry.cook,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  startButton: {
    backgroundColor: COLORS.orange.main,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.gray,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});

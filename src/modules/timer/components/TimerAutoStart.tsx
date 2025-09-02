import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveHeight } from "../../shared/utils/responsiveUI";
import { responsiveWidth } from "../../shared/utils/responsiveUI";

interface TimerAutoStartProps {
  duration?: number;
  onStartNow: () => void;
  onCancel: () => void;
}

export const TimerAutoStart = ({
  onStartNow,
  onCancel,
}: TimerAutoStartProps) => {
  const duration = 10;
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const progress = useSharedValue(0);
  const countdownScale = useSharedValue(1);

  useEffect(() => {
    setSecondsLeft(duration);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          setTimeout(() => {
            onStartNow();
          }, 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onStartNow]);

  useEffect(() => {
    const progressValue = (duration - secondsLeft) / duration;
    progress.value = withTiming(progressValue, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [secondsLeft, duration, progress]);

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

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.statusText}>
          타이머가 {secondsLeft}초 후 자동 시작됩니다
        </Text>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost]}
          onPress={onCancel}
        >
          <Text style={styles.btnGhostText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onStartNow}
        >
          <Text style={styles.btnPrimaryText}>지금 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: responsiveHeight(12),
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    marginTop: responsiveHeight(8),
    color: COLORS.text.gray,
    fontSize: responsiveWidth(16),
    fontWeight: "600",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    paddingTop: responsiveHeight(16),
    gap: responsiveWidth(12),
  },
  btn: {
    flex: 1,
    paddingVertical: responsiveHeight(14),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  btnPrimary: {
    backgroundColor: COLORS.orange.main,
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  btnSecondary: {
    backgroundColor: COLORS.background.secondaryLightGray,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  btnSecondaryText: {
    color: COLORS.font.dark,
    fontWeight: "700",
  },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  btnGhostText: {
    color: COLORS.text.gray,
    fontWeight: "700",
  },
});

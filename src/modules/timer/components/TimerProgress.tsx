import React, { useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  Easing,
  cancelAnimation,
  runOnUI,
} from "react-native-reanimated";
import { TimerState } from "@/src/modules/timer/hooks/useTimerStore";
import { useCountdownTimerState } from "@/src/modules/timer/hooks/useCountdownTimer";

export function TimerProgress() {
  const size = 300;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const {
    duration: total,
    remainingTime: remaining,
    state: timerState,
  } = useCountdownTimerState();
  const progress = useSharedValue(1); // 1에서 시작 (풀서클)
  const wasRunningRef = useRef<boolean>(false);
  const lastRemainingRef = useRef<number>(remaining);
  const isRunning = timerState === TimerState.ACTIVE;
  const expected = useMemo(() => {
    if (!total || total <= 0) return 1;
    return Math.min(1, Math.max(0, remaining / total));
  }, [total, remaining]);

  useEffect(() => {
    if (timerState === TimerState.FINISHED) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    // 아이들 상태면 풀서클로 리셋
    if (timerState === TimerState.IDLE) {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    const wasRunning = wasRunningRef.current;

    if (isRunning && !wasRunning) {
      cancelAnimation(progress);

      if (Math.abs(progress.value - expected) > 0.01) {
        progress.value = expected;
      }

      const durationMs = Math.max(0, Math.round(remaining * 1000));
      progress.value = withTiming(0, {
        // 0으로 줄어들도록
        duration: durationMs,
        easing: Easing.linear,
      });
    } else if (!isRunning && wasRunning) {
      cancelAnimation(progress);
    } else if (!isRunning && !wasRunning) {
      cancelAnimation(progress);
      progress.value = expected;
    } else if (isRunning && wasRunning) {
      runOnUI(() => {
        "worklet";
        const delta = Math.abs(progress.value - expected);
        if (delta > 0.05) {
          cancelAnimation(progress);
          progress.value = expected;
          const durationMs = Math.max(0, Math.round(remaining * 1000));
          progress.value = withTiming(0, {
            // 0으로 줄어들도록
            duration: durationMs,
            easing: Easing.linear,
          });
        }
      })();
    }

    wasRunningRef.current = isRunning;
    lastRemainingRef.current = remaining;
  }, [isRunning, expected, remaining, total, timerState]);

  const arc = useDerivedValue(() => {
    const sweep = 2 * Math.PI * progress.value;
    const path = Skia.Path.Make();
    path.addArc(
      {
        x: stroke / 2,
        y: stroke / 2,
        width: size - stroke,
        height: size - stroke,
      },
      -90, // 12시 방향에서 시작
      (sweep * 180) / Math.PI,
    );
    return path;
  }, [size, stroke]);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas style={{ width: size, height: size }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          color="#FFD9C7"
          style="stroke"
          strokeWidth={stroke}
        />
        <Path
          path={arc}
          color="#FF4500"
          style="stroke"
          strokeWidth={stroke}
          strokeCap="round"
        />
      </Canvas>
      <View style={StyleSheet.absoluteFillObject}>
        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: size / 2 - 20,
          }}
        >
          {formatTime(remaining)}
        </Text>
      </View>
    </View>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = (m % 60).toString().padStart(2, "0");
    return `${h}:${mm}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

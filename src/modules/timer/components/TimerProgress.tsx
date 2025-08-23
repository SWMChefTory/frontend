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

type Props = {
  total: number;
  remaining: number;
  size?: number;
  stroke?: number;
  isRunning?: boolean;
};

export function TimerProgress({
  total,
  remaining,
  size = 300,
  stroke = 10,
  isRunning = false,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const progress = useSharedValue(0);

  const wasRunningRef = useRef<boolean>(false);
  const lastRemainingRef = useRef<number>(remaining);

  const expected = useMemo(() => {
    if (!total || total <= 0) return 0;
    return Math.min(1, Math.max(0, (total - remaining) / total));
  }, [total, remaining]);

  useEffect(() => {
    if (!total || total <= 0) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    const wasRunning = wasRunningRef.current;

    if (isRunning && !wasRunning) {
      cancelAnimation(progress);

      if (Math.abs(progress.value - expected) > 0.01) {
        progress.value = expected;
      }

      const durationMs = Math.max(0, Math.round(remaining * 1000));
      progress.value = withTiming(1, {
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
          progress.value = withTiming(1, {
            duration: durationMs,
            easing: Easing.linear,
          });
        }
      })();
    }

    wasRunningRef.current = isRunning;
    lastRemainingRef.current = remaining;
  }, [isRunning, expected, remaining, total]);

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
      -90,
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
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: size / 2 - 12,
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

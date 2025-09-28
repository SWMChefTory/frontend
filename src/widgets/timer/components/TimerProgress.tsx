import React, { useEffect, useRef, useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import {
  responsiveFontSize,
  responsiveWidth,
} from "@/src/modules/shared/utils/responsiveUI";
import { TimerState } from "../hooks/store/useTimerSnapshotStore";
import { useTheme } from "react-native-paper";

/**
 * remaining과 total을 비교해서 타이머 진행 상태를 표현해준다.
 * @returns 타이머 진행 상태 표현
 */
export function TimerProgress({
  state,
  totalMilliSec,
  remainingMilliSec: remainingMilliSec,
  onFinish,
  size = responsiveWidth(300),
  stroke = responsiveWidth(10),
  fontSize = responsiveFontSize(12),
}: {
  state: TimerState;
  totalMilliSec: number;
  remainingMilliSec: number;
  isFromBackground: boolean;
  onFinish: () => void;
  size?: number;
  stroke?: number;
  fontSize?: number;
}) {
  const theme = useTheme();
  const r = (size - stroke) / 2; //반지름
  const progress = useSharedValue(1); // 1에서 시작 (풀서클)

  const expected = useMemo(() => {
    if (state === TimerState.FINISHED) return 0;
    if (state === TimerState.IDLE) return 1;
    return Math.min(1, Math.max(0, remainingMilliSec / totalMilliSec));
  }, [state, totalMilliSec, remainingMilliSec]);

  useEffect(() => {
    if (state === TimerState.FINISHED) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    // 아이들 상태면 풀서클로 리셋
    if (state === TimerState.IDLE) {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    if (state === TimerState.ACTIVE) {
      cancelAnimation(progress);
      progress.value = expected;
      progress.value = withTiming(
        0,
        {
          // 0으로 줄어들도록
          duration: remainingMilliSec,
          easing: Easing.linear,
        },
        (isFinished) => {
          "worklet";
          if (!isFinished) {
            return;
          }
          runOnJS(onFinish)();
        }
      );
      return;
    }

    if (state === TimerState.PAUSED) {
      cancelAnimation(progress);
      progress.value = expected;
      return;
    }
  }, [state, expected, remainingMilliSec, totalMilliSec]);

  //호의 모양과 크기
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
      (-sweep * 180) / Math.PI
    );
    return path;
  }, [size, stroke]);

  const secSV = useDerivedValue(() =>
    Math.max(0, Math.floor((progress.value * totalMilliSec) / 1000))
  );

  const [label, setLabel] = React.useState("");

  useAnimatedReaction(
    () => secSV.value,
    (s, prev) => {
      if (s !== prev) {
        const hh = Math.floor(s / 3600);
        const mm = Math.floor((s % 3600) / 60);
        const ss = s % 60;
        runOnJS(setLabel)(
          (hh > 0 ? `${hh}:` : "") +
            `${mm}`.padStart(2, "0") +
            ":" +
            `${ss}`.padStart(2, "0")
        );
      }
    }
  );

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
          // color={theme.colors.primary}
          color="black"
          style="stroke"
          strokeWidth={stroke}
          strokeCap="round"
        />
      </Canvas>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text
          style={{
            fontSize: fontSize,
            fontWeight: "bold",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

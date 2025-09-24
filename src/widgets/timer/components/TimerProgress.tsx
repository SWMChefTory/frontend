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
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "@/src/modules/shared/utils/responsiveUI";
import { TimerState } from "../hooks/store/useTimerSnapshotStore";

/**
 * remaining과 total을 비교해서 타이머 진행 상태를 표현해준다.
 * @returns 타이머 진행 상태 표현
 */
export function TimerProgress({
  state,
  totalMicroSec,
  remainingMicroSec,
  onFinish,
}: {
  state: TimerState;
  totalMicroSec: number;
  remainingMicroSec: number;
  isFromBackground: boolean;
  onFinish: () => void;
}) {
  const size = responsiveWidth(300);
  const stroke = responsiveWidth(10);
  const r = (size - stroke) / 2; //반지름
  const progress = useSharedValue(1); // 1에서 시작 (풀서클)

  const expected = useMemo(()=>{
    if(state === TimerState.FINISHED) return 0;
    if(state === TimerState.IDLE) return 1;
    return Math.min(1, Math.max(0, remainingMicroSec / totalMicroSec));
  }, [state, totalMicroSec, remainingMicroSec]);

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

    if(state === TimerState.ACTIVE){
      cancelAnimation(progress);
      progress.value = expected;
      return;
    }

    if(state === TimerState.PAUSED){
      cancelAnimation(progress);
      progress.value = expected;
      progress.value = withTiming(0, {
        // 0으로 줄어들도록
        duration: remainingMicroSec,
        easing: Easing.linear,
      },(isFinished)=>{
        if(isFinished){
          onFinish();
        }
      });
      return;
    }
  }, [state, expected, remainingMicroSec, totalMicroSec]);

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
      (sweep * 180) / Math.PI
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
            fontSize: responsiveFontSize(40),
            fontWeight: "bold",
            textAlign: "center",
            marginTop: size / 2 - responsiveHeight(20),
          }}
        >
          {formatTime(remainingMicroSec/1000)}
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

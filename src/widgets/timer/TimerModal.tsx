import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { TimerHeader } from "@/src/widgets/timer/components/TimerHeader";
import { TimerProgress } from "@/src/widgets/timer/components/TimerProgress";
import { TimerIdle } from "@/src/widgets/timer/components/TimerIdle";
import { TimerRunning } from "@/src/widgets/timer/components/TimerRunning";
import { TimerPause } from "@/src/widgets/timer/components/TimerPause";
import { TimerFinish } from "@/src/widgets/timer/components/TimerFinish";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTimer } from "@/src/widgets/timer/hooks/useTimer";
import {
  TimerState,
} from "@/src/widgets/timer/hooks/store/useTimerSnapshotStore";

export type TimerModalProps = {
  onRequestClose: () => void;
  recipeId: string;
  recipeTitle: string;
  // timerIntentType?: WebViewMessageType;
  // timerAutoTime?: number;
  onNavigateToRecipe: (recipeId: string, recipeTitle: string) => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
};

/**
 *
 * @param onRequestClose 모달 닫는 요청
 * @param recipeId
 * @param recipeTitle
 * @param timerIntentType 타이머가 메세지로 시작되었울 때, 사용되는 변수
 * @param timerAutoTime 타이머가 자동으로 시작되었을 때의 시간
 * @param onNavigateToRecipe
 * @param bottomSheetModalRef
 * @returns
 */
const TimerModal = ({
  onRequestClose,
  recipeId: currentRecipeId,
  recipeTitle: currentRecipeTitle,
  onNavigateToRecipe,
  bottomSheetModalRef,
}: TimerModalProps) => {
  //유저가 설정한 시간(초)

  const insets = useSafeAreaInsets();

  const {
    state,
    totalMilliSec,
    name: timerRecipeTitle,
    recipeId: timerRecipeId,
    remainingMilliSec,
    manualActions: {
      start,
      // cancelReservation,
      pause,
      resume,
      reset,
    },
    autoActions: { finish },
  } = useTimer();

  const handleStart = (totalMilliSecInputVal: number) => {
    console.log("[TimerModal] handleStart 호출 시, totalMilliSecInputVal:", totalMilliSecInputVal);
    if (state !== TimerState.IDLE && state !== TimerState.FINISHED) {
      console.warn(
        "TimerModal handleStart 호출 시, state가 IDLE 또는 FINISHED가 아닙니다."
      );
      return;
    }
    if (totalMilliSecInputVal <= 0) {
      console.warn(
        "TimerModal handleStart 호출 시, totalMilliSecInputValue가 0보다 작습니다."
      );
      return;
    }
    start({
      name: currentRecipeTitle,
      recipeId: currentRecipeId,
      totalMilliSec: totalMilliSecInputVal,
    });
  };

  const handleNavigate = () => {
    if (timerRecipeId && timerRecipeTitle) {
      onNavigateToRecipe(timerRecipeId, timerRecipeTitle);
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={[responsiveHeight(432)]}
      onChange={(index) => index === -1 && onRequestClose()}
      enablePanDownToClose={true}
      enableOverDrag={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animateOnMount={true}
      enableDynamicSizing={false}
      activeOffsetY={[-1, 1]}
      failOffsetX={[-5, 5]}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
    >
      <View
        style={[
          styles.contentContainer,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <TimerHeader recipeTitle={timerRecipeTitle || currentRecipeTitle} />

        {state === TimerState.IDLE && (
          <TimerIdle
            initialSeconds={Math.ceil(totalMilliSec/1000)}
            onStart={handleStart}
            onClose={() => onRequestClose()}
          />
        )}

        {state !== TimerState.IDLE && (
          <View style={styles.progressContainer}>
            <TimerProgress
              state={state}
              totalMilliSec={totalMilliSec}
              remainingMilliSec={remainingMilliSec || 0}
              isFromBackground={false}
              onFinish={() => {
                finish();
              }}
              size={responsiveHeight(216)}
              stroke={responsiveHeight(10)}
              fontSize={responsiveFontSize(40)}
            />
          </View>
        )}

        {state === TimerState.ACTIVE && (
          <TimerRunning
            onPause={pause}
            onEnd={reset}
            remaingMilliSec={remainingMilliSec || 0}
          />
        )}

        {state === TimerState.PAUSED && (
          <TimerPause onResume={resume} onEnd={reset} />
        )}

        {state === TimerState.FINISHED && <TimerFinish onEnd={reset} />}
        {/* {state !== TimerState.IDLE &&
          (
            <TimerDifferent
              onGoToRecipe={handleNavigate}
              onClose={() => onRequestClose()}
            />
          )} */}

        {/* TODO : 어케할지 감이 안오네요.. */}
        {/* {state === TimerState.IDLE && isAutoStartActive && (
          <TimerAutoStart
            onChangeDelayTime={handleStart}
            onCancel={handleCancelAutoStart}
          />
        )} */}
      </View>
    </BottomSheetModal>
  );
};

export default TimerModal;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.priamry.cook,
  },
  handleIndicator: {
    backgroundColor: COLORS.border.lightGray,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(18),
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: responsiveHeight(40),
  },
});

import { StyleSheet, View } from "react-native";
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
import { TimerState } from "@/src/widgets/timer/hooks/store/useTimerSnapshotStore";
import { router } from "expo-router";

export type TimerModalProps = {
  recipeId: string;
  recipeTitle: string;
  onClose: () => void;
};

/**
 *
 * @param recipeId
 * @param recipeTitle
 * @returns
 */
const Timer = ({
  recipeId: currentRecipeId,
  recipeTitle: currentRecipeTitle,
  onClose,
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
    console.log(
      "[TimerModal] handleStart 호출 시, totalMilliSecInputVal:",
      totalMilliSecInputVal
    );
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

  const isNavigateable =
    timerRecipeId && timerRecipeTitle && timerRecipeId !== currentRecipeId;
    console.log("isNavigateable!!!!!!!!!!!", isNavigateable);
    console.log("timerRecipeId!!!!!!!!!!!", timerRecipeId);
    console.log("timerRecipeTitle!!!!!!!!!!!", timerRecipeTitle);
    console.log("currentRecipeId!!!!!!!!!!!", currentRecipeId);
    console.log("currentRecipeTitle!!!!!!!!!!!", currentRecipeTitle);


  const handleNavigateToRecipe = () => {
    if (!(timerRecipeId && timerRecipeTitle)) {
      console.warn(
        "Timer handleNavigate 호출 시, recipeId 또는 recipeTitle이 없습니다."
      );
      return;
    }
    router.replace({
      pathname: "/recipe/detail",
      params: {
        recipeId: timerRecipeId,
        title: timerRecipeTitle,
        isTimer: "true",
      },
    } as any);
  };

  return (
    <View
      style={[
        styles.contentContainer,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <TimerHeader
        recipeTitle={timerRecipeTitle || currentRecipeTitle}
        onClose={onClose}
        onPress={isNavigateable ? handleNavigateToRecipe : undefined}
      />

      {state === TimerState.IDLE && (
        <TimerIdle
          initialSeconds={Math.ceil(totalMilliSec / 1000)}
          onStart={handleStart}
          onClose={() => {}}
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
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.primary.cook,
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
  },
});

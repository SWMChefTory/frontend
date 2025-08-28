import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useCountdownTimer } from "@/src/modules/timer/hooks/useCountdownTimer";
import { useLiveActivity } from "@/src/modules/timer/hooks/useLiveActivity";
import {
  cancelTimerAlarm,
  ensureNotificationReady,
  scheduleTimerAlarm,
} from "@/src/modules/notifications/timerNotifications";
import { WebViewMessageType } from "@/src/modules/recipe/detail/types/RecipeDetail";

import { TimerAutoStart } from "@/src/modules/timer/components/TimerAutoStart";
import { TimerHeader } from "@/src/modules/timer/components/TimerHeader";
import { TimerProgress } from "@/src/modules/timer/components/TimerProgress";
import { TimerIdle } from "@/src/modules/timer/components/TimerIdle";
import { TimerRunning } from "@/src/modules/timer/components/TimerRunning";
import { TimerPause } from "@/src/modules/timer/components/TimerPause";
import { TimerFinish } from "@/src/modules/timer/components/TimerFinish";
import {
  TimerState,
  TimerStatus,
} from "@/src/modules/timer/hooks/useTimerStore";
import { TimerDifferent } from "@/src/modules/timer/components/TimerDifference";

export type TimerModalProps = {
  onRequestClose: () => void;
  recipeId: string;
  recipeTitle: string;
  timerIntentType?: WebViewMessageType;
  timerAutoTime?: number;
  onNavigateToRecipe: (recipeId: string, recipeTitle: string) => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
};

const TimerModal = ({
  onRequestClose,
  recipeId,
  recipeTitle,
  timerIntentType,
  timerAutoTime,
  onNavigateToRecipe,
  bottomSheetModalRef,
}: TimerModalProps) => {
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [isAutoStartActive, setIsAutoStartActive] = useState<boolean>(false);
  
  useEffect(() => {
    ensureNotificationReady().catch((e: any) => {
      console.warn("알림 준비 실패:", e);
    });
  }, []);

  const liveActivity = useLiveActivity();

  const {
    getTimerStatus,
    getRemainingTime,
    name,
    getLivePayload,
    state,
    reset,
    pause,
    resume,
    start,
    setDuration,
    recipeId: existId,
  } = useCountdownTimer();
  const handleStart = async () => {
    start({
      name: recipeTitle,
      recipeId: recipeId,
      duration: durationSeconds,
    });
    if (Platform.OS === "ios" && liveActivity.isLiveActivityAvailable) {
      await liveActivity.startActivity({
        deepLink: `cheiftory://recipe/detail?recipeId=${recipeId}&isTimer=true&title=${recipeTitle}`,
        activityName: recipeTitle,
        duration: durationSeconds,
      });
    }

    await scheduleTimerAlarm(recipeTitle, recipeId, durationSeconds);
    setIsAutoStartActive(false);

    if (isAutoStartActive) {
      setTimeout(() => {
        onRequestClose();
      }, 500);
    }
  };
  async function handlePause() {
    pause();
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      const payload = getLivePayload();
      await liveActivity.pauseActivity(payload);
    }
    await cancelTimerAlarm();
  }

  async function handleIdle() {
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      await liveActivity.endActivity();
    }
    await cancelTimerAlarm();
    reset();
  }

  async function handleResume() {
    if (Math.floor(getRemainingTime()) <= 0) {
      return;
    }
    resume();
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      const payload = getLivePayload();
      await liveActivity.resumeActivity(payload);
    }
    await scheduleTimerAlarm(
      name || recipeTitle,
      existId || recipeId,
      Math.floor(getRemainingTime()),
    );
  }

  async function handleEnd() {
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      await liveActivity.endActivity();
    }
    await cancelTimerAlarm();
    setIsAutoStartActive(false);
    onRequestClose();
    reset();
  }
  async function handleClose() {
    onRequestClose();
  }

  function handleTimeChange(totalSeconds: number) {
    setDurationSeconds(totalSeconds);
  }

  function handleCancelAutoStart() {
    setIsAutoStartActive(false);
  }

  useEffect(() => {
    if (!timerIntentType) return;
    console.log("timerIntentType", timerIntentType);
    switch (timerIntentType) {
      case WebViewMessageType.TIMER_SET: {
        if (timerAutoTime && timerAutoTime > 0 && state === TimerState.IDLE) {
          setDurationSeconds(timerAutoTime);
          setDuration(timerAutoTime);
          setIsAutoStartActive(true);
        }
        break;
      }
  
      case WebViewMessageType.TIMER_STOP:
        console.log("TIMER_STOP");
        setIsAutoStartActive(false);
        if (state === TimerState.ACTIVE) {
          handlePause();
        }
        setTimeout(() => {
          onRequestClose();
        }, 1000);
        break;
  
      default:
        setIsAutoStartActive(false);
        break;
    }
  }, [timerIntentType]);

  const handleNavigate = () => {
    if (existId) {
      onNavigateToRecipe(existId, name || recipeTitle);
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
    [],
  );

  return (
    <BottomSheetModal 
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={["70%"]}
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
      <View style={styles.contentContainer}>
        <TimerHeader recipeTitle={name || recipeTitle} />

        {(state !== TimerState.IDLE || isAutoStartActive) && (
          <View style={styles.progressContainer}>
            <TimerProgress />
          </View>
        )}

        {state === TimerState.IDLE && isAutoStartActive && (
          <TimerAutoStart
            onStartNow={handleStart}
            onCancel={handleCancelAutoStart}
          />
        )}

        {state === TimerState.IDLE &&
          !isAutoStartActive &&
          getTimerStatus(recipeId) === TimerStatus.NONE && (
            <TimerIdle
              initialSeconds={durationSeconds}
              onTimeChange={handleTimeChange}
              onStart={handleStart}
              onClose={handleClose}
              isStartDisabled={durationSeconds <= 0}
            />
          )}

        {state === TimerState.ACTIVE &&
          getTimerStatus(recipeId) === TimerStatus.SAME_RECIPE && (
            <TimerRunning onPause={handlePause} onEnd={handleIdle} />
          )}

        {state === TimerState.PAUSED &&
          getTimerStatus(recipeId) === TimerStatus.SAME_RECIPE && (
            <TimerPause onResume={handleResume} onEnd={handleIdle} />
          )}

        {state === TimerState.FINISHED &&
          getTimerStatus(recipeId) === TimerStatus.SAME_RECIPE && (
            <TimerFinish onEnd={handleEnd} />
          )}
        {state !== TimerState.IDLE &&
          getTimerStatus(recipeId) === TimerStatus.DIFFERENT_RECIPE && (
            <TimerDifferent
              onGoToRecipe={handleNavigate}
              onClose={handleClose}
            />
          )}
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
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
});

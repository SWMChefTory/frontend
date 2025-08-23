import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useCountdownTimer } from "@/src/modules/timer/hooks/useCountdownTimer";
import { useLiveActivity } from "@/src/modules/timer/hooks/useLiveActivity";
import {
  cancelTimerAlarm,
  ensureNotificationReady,
  scheduleTimerNotification,
} from "@/src/modules/notifications/timerNotifications";
import { WebViewMessageType } from "@/src/modules/recipe/detail/types/RecipeDetail";

import { AutoStartView } from "@/src/modules/timer/components/AutoStartView";
import { TimerHeader } from "@/src/modules/timer/components/TimerHeader";
import { TimerProgress } from "@/src/modules/timer/components/TimerProgress";
import { TimerIdleView } from "@/src/modules/timer/components/TimerIdle";
import { TimerRunningView } from "@/src/modules/timer/components/TimerRunningView";
import { TimerPausedView } from "@/src/modules/timer/components/TimerPausedView";
import { TimerFinishedView } from "@/src/modules/timer/components/TimerFinishedView";
import { TimerState } from "@/src/modules/timer/hooks/useTimerStore";

export type TimerModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  recipeId: string;
  recipeTitle: string;
  timerIntentType?: WebViewMessageType;
  timerAutoTime?: number;
};

export default function TimerModal({
  visible,
  onRequestClose,
  recipeId,
  recipeTitle,
  timerIntentType,
  timerAutoTime,
}: TimerModalProps) {
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  const [autoStartCountdown, setAutoStartCountdown] = useState<number>(0);
  const autoStartIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const lastIntentRef = useRef<{
    type?: WebViewMessageType;
    time?: number;
    timestamp: number;
  }>({ timestamp: 0 });

  const clearAutoStart = useCallback(() => {
    if (autoStartIntervalRef.current) {
      clearInterval(autoStartIntervalRef.current);
      autoStartIntervalRef.current = null;
    }
    setAutoStartCountdown(0);
  }, []);

  useEffect(() => {
    ensureNotificationReady().catch((e: any) => {
      console.warn("알림 준비 실패:", e);
    });
  }, []);

  const sheetY = useRef(new Animated.Value(40)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(sheetY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(sheetOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      sheetY.setValue(40);
      sheetOpacity.setValue(0);
    }
  }, [visible, sheetY, sheetOpacity]);

  const liveActivity = useLiveActivity();

  const timer = useCountdownTimer({
    name: recipeTitle,
    onComplete: async () => {
      clearAutoStart();
      if (Platform.OS === "ios" && liveActivity.liveActivityId) {
        await liveActivity.endActivity();
      }
      cancelTimerAlarm().catch((e: any) => {
        console.warn("알림 취소 실패:", e);
      });
    },
  });

  const isStartingRef = useRef(false);

  const handleStart = async () => {
    if (isStartingRef.current) return;
    if (timer.duration <= 0) {
      return;
    }

    isStartingRef.current = true;
    try {
      timer.start();

      if (Platform.OS === "ios" && liveActivity.isLiveActivityAvailable) {
        await liveActivity.startActivity({
          deepLink: `cheiftory://recipe/detail?recipeId=${recipeId}&isTimer=true&title=${recipeTitle}`,
          activityName: recipeTitle,
          duration: timer.duration,
        });
      }

      await scheduleTimerNotification(recipeTitle, recipeId, timer.duration);
    } finally {
      isStartingRef.current = false;
    }
  };

  const handlePause = async () => {
    timer.pause();
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      const payload = timer.getLivePayload();
      await liveActivity.pauseActivity(payload);
    }
    await cancelTimerAlarm();
  };

  const handleIdle = async () => {
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      await liveActivity.endActivity();
    }
    await cancelTimerAlarm();
    timer.reset();
  };

  const handleResume = async () => {
    if (Math.floor(timer.remainingTime) <= 0) {
      return;
    }

    timer.resume();
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      const payload = timer.getLivePayload();
      await liveActivity.resumeActivity(payload);
    }
    await scheduleTimerNotification(
      recipeTitle,
      recipeId,
      Math.floor(timer.remainingTime),
    );
  };

  const handleEnd = async () => {
    if (Platform.OS === "ios" && liveActivity.liveActivityId) {
      await liveActivity.endActivity();
    }
    await cancelTimerAlarm();
    onRequestClose?.();
    timer.reset();
  };

  const startAutoStartCountdown = useCallback(() => {
    setAutoStartCountdown(10);

    autoStartIntervalRef.current = setInterval(() => {
      setAutoStartCountdown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (autoStartIntervalRef.current) {
            clearInterval(autoStartIntervalRef.current); // 1. 먼저 정리
            autoStartIntervalRef.current = null;
          }

          setTimeout(() => {
            handleStart(); // 2. 안전한 환경에서 실행
          }, 0);
        }
        return next;
      });
    }, 1000);
  }, []);

  const handleTimeChange = useCallback(
    (totalSeconds: number) => {
      setDurationSeconds(totalSeconds);
      timer.setDuration(totalSeconds);
    },
    [timer],
  );

  useEffect(() => {
    if (!visible || !timerIntentType) return;

    const now = Date.now();
    const lastIntent = lastIntentRef.current;

    if (
      lastIntent.type === timerIntentType &&
      lastIntent.time === timerAutoTime &&
      now - lastIntent.timestamp < 500
    ) {
      return;
    }

    lastIntentRef.current = {
      type: timerIntentType,
      time: timerAutoTime,
      timestamp: now,
    };

    switch (timerIntentType) {
      case WebViewMessageType.TIMER_SET: {
        if (!timerAutoTime) break;
        setDurationSeconds(timerAutoTime);
        timer.setDuration(timerAutoTime);

        if (timerAutoTime > 0) {
          setTimeout(() => {
            if (!isStartingRef.current && timer.state === TimerState.IDLE) {
              startAutoStartCountdown();
            }
          }, 100);
        }
        break;
      }

      case WebViewMessageType.TIMER_STOP:
        clearAutoStart();
        if (timer.state === TimerState.ACTIVE) {
          handlePause();
        }
        break;

      default:
        clearAutoStart();
        break;
    }
  }, [visible]);

  useEffect(() => {
    return clearAutoStart;
  }, [clearAutoStart, timerIntentType]);

  const isAutoStartActive = autoStartCountdown > 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />
        <Animated.View
          style={[
            styles.sheet,
            { opacity: sheetOpacity, transform: [{ translateY: sheetY }] },
          ]}
        >
          <TimerHeader recipeTitle={recipeTitle} />

          {(timer.state !== TimerState.IDLE || isAutoStartActive) && (
            <View style={styles.progressContainer}>
              <TimerProgress
                key="main-timer-progress"
                total={timer.duration}
                remaining={timer.remainingTime}
                isRunning={timer.state === TimerState.ACTIVE}
              />
            </View>
          )}

          {timer.state === TimerState.IDLE && isAutoStartActive && (
            <AutoStartView
              secondsLeft={autoStartCountdown}
              onStartNow={() => {
                clearAutoStart();
                handleStart();
              }}
              onCancel={clearAutoStart}
            />
          )}

          {timer.state === TimerState.IDLE && !isAutoStartActive && (
            <TimerIdleView
              initialSeconds={durationSeconds}
              onTimeChange={handleTimeChange}
              onStart={() => {
                handleStart();
              }}
              onCancel={handleEnd}
              isStartDisabled={isStartingRef.current}
            />
          )}

          {timer.state === TimerState.ACTIVE && (
            <TimerRunningView
              remainingTime={timer.remainingTime}
              onPause={handlePause}
              onEnd={handleIdle}
            />
          )}

          {timer.state === TimerState.PAUSED && (
            <TimerPausedView
              onResume={handleResume}
              onEnd={handleIdle}
            />
          )}

          {timer.state === TimerState.FINISHED && (
            <TimerFinishedView onEnd={handleEnd} />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.priamry.cook,
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border.lightGray,
    shadowColor: COLORS.shadow.black,
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});

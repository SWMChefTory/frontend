// import { useAppState } from "@/src/modules/timer/hooks/useAppState";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveActivity } from "@/src/widgets/timer/hooks/live-activity/useLiveActitiy";
import useTimerSnapshotStore, {
  TimerState,
  ActiveTimeInfo,
  PausedTimeInfo,
  TimeInfo,
} from "@/src/widgets/timer/hooks/store/useTimerSnapshotStore";
import {
  scheduleTimerAlarm,
  cancelTimerAlarm,
} from "@/src/widgets/timer/hooks/notifications/timerNotifications";
import { useAppState } from "@/src/widgets/timer/hooks/app-state/useAppState";

export interface UseTimerReturn {
  state: TimerState;
  name: string | null;
  recipeId: string | null;
  //유저가 수동으로 작동시킬 수 있는 액션
  totalMilliSec: number;
  // isTimerReserved: boolean
  remainingMilliSec: number | null;
  manualActions: {
    start: ({
      recipeId,
      name,
      totalMilliSec,
    }: {
      recipeId: string;
      name: string;
      totalMilliSec: number;
    }) => void;
    /**
     * autoStart는 타이머를 나중에 작동시킬 수 있는 액션.
     * @param name
     * @param recipeId
     * @param totalMilliSec
     * @param startDelay 액션 실행 전 대기 시간
     * @returns
     */
    // reserveStart: (name: string, recipeId: string, totalMilliSec: number, startDelay: number) => void;
    // cancelReservation: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
  };
  //타이머가 자동으로 작동시킬 수 있는 액션
  autoActions: {
    finish: () => void;
  };
}

function convertMilliSecToSeconds(milliSec: number): number {
  return milliSec / 1000;
}

export function useTimer(): UseTimerReturn {
  const {
    recipeId,
    name,
    totalMilliSec,
    state: snapshotState,
    timeInfo: snapshotTimeInfo,
    capture, //capture 함수는 타이머 상태를 변경하는 함수를 모아둔 객체
  } = useTimerSnapshotStore();

  const { activityActions } = useLiveActivity();

  const { currentAppState, previousAppState } = useAppState();

  // const [isTimerReserved, setIsStartReserved] = useState(false);
  //TODO : 추후 사용 예정
  // const [reservationRemainingMilliSec, setReservationRemainingMilliSec] = useState(0);
  // const timerReservationRef = useRef<number | null>(null);

  const start = useCallback(
    ({
      name,
      recipeId,
      totalMilliSec,
    }: {
      name: string;
      recipeId: string;
      totalMilliSec: number;
    }) => {
      if (snapshotState === TimerState.ACTIVE) return;
      // if(isTimerReserved) return;
      console.log("[Timer] start 호출 시, totalMilliSec:", totalMilliSec);
      const endAt = new Date(Date.now() + totalMilliSec);
      console.log("[Timer] start 호출 시, endAt:", endAt);
      capture.start({ name, recipeId, totalMilliSec: totalMilliSec, endAt });
      console.log("[Timer] start 호출 시, activityActions.start 호출");
      activityActions.start({
        activityName: name,
        deepLink: `cheftory://recipe/detail?recipeId=${recipeId}&isTimer=true&title=${name}`,
        endAt,
        totalMilliSec: totalMilliSec,
      });
      scheduleTimerAlarm(
        name,
        recipeId,
        convertMilliSecToSeconds(totalMilliSec)
      );
    },
    [capture, activityActions, scheduleTimerAlarm]
  );

  //TODO : 추후 사용 예정
  // const scheduleNextTick = (name: string, recipeId: string, totalMilliSec: number) => {
  //   timerReservationRef.current = setTimeout(() => {
  //     setReservationRemainingMilliSec((prev) => {
  //       const newValue = prev - 1000;

  //       if (newValue <= 0) {
  //         setIsStartReserved(false);
  //         start({name, recipeId, totalMilliSec});
  //         return 0;
  //       }

  //       scheduleNextTick(name, recipeId, totalMilliSec); // 다음 실행 예약
  //       return newValue;
  //     });
  //   }, 1000);
  // };

  //TODO : 추후 사용 예정
  // const reserveStart = useCallback(
  //   (name: string, recipeId: string, totalMilliSec: number, startDelay: number) => {
  //     if(snapshotState !== TimerState.IDLE) return;
  //     setIsStartReserved(true);
  //     scheduleNextTick(name, recipeId, totalMilliSec);
  //   },
  //   [start, name, recipeId, totalMilliSec]
  // );

  //TODO : 추후 사용 예정
  // const cancelReservation = useCallback(
  //   () => {
  //     if(!isTimerReserved) return;
  //     if(timerReservationRef.current) {
  //       clearTimeout(timerReservationRef.current);
  //       timerReservationRef.current = null;
  //     }
  //     setIsStartReserved(false);
  //   },
  //   [isTimerReserved]
  // );

  const pause = useCallback(() => {
    if (snapshotState !== TimerState.ACTIVE) return;
    const pausedAt = new Date();
    const remainingMilliSec =
      (snapshotTimeInfo as ActiveTimeInfo).endAt.getTime() - Date.now();
    capture.pause({ pausedAt, remainingMilliSec });
    activityActions.pause(pausedAt, remainingMilliSec);
    cancelTimerAlarm();
  }, [capture, activityActions, cancelTimerAlarm, snapshotState, snapshotTimeInfo]);

  const resume = useCallback(() => {
    if (snapshotState !== TimerState.PAUSED) return;
    const remainingMilliSec = (snapshotTimeInfo as PausedTimeInfo)
      .remainingMilliSec;
    const endAt = new Date(Date.now() + remainingMilliSec);
    console.log("[Timer] resume 호출 시, remainingMilliSec:", remainingMilliSec);
    console.log("[Timer] resume 호출 시, endAt:", endAt);
    capture.resume({ endAt });
    activityActions.resume(endAt);
    if (!name || !recipeId) {
      throw new Error("타이머를 재개하려면 레시피 정보가 필수입니다.");
    }
    scheduleTimerAlarm(
      name,
      recipeId,
      convertMilliSecToSeconds(remainingMilliSec)
    );
  }, [capture, activityActions, scheduleTimerAlarm, snapshotState]);

  const finish = useCallback(() => {
    if (
      snapshotState !== TimerState.ACTIVE &&
      snapshotState !== TimerState.PAUSED
    )
      return;
    capture.finish();
    const result = activityActions.end();
    console.log("[Timer] finish 호출 시!!!!!!!!!!!!!!!!!!!!!!!!!!, activityActions.end 호출 결과:", result);
  }, [capture, activityActions, snapshotState]);

  const reset = useCallback(() => {
    if (snapshotState === TimerState.IDLE) return;
    capture.reset();

    if (snapshotState === TimerState.FINISHED) return;
    activityActions.end();
    cancelTimerAlarm();
  }, [capture, activityActions, cancelTimerAlarm, snapshotState]);

  useEffect(() => {
    if (snapshotState !== TimerState.ACTIVE) {
      return;
    }
    if (previousAppState !== "active") {
      return;
    }
    const timeInfo = snapshotTimeInfo as ActiveTimeInfo;
    if (timeInfo.endAt.getTime() - Date.now() <= 0) {
      capture.finish(); //activity.end()는 activity가 알아서 종료하기 때문에 호출할 필요 없음.
    }
  }, [
    snapshotState,
    snapshotTimeInfo,
    currentAppState,
    previousAppState,
    capture,
  ]);

  const remainingMilliSec = (() => {
    if (snapshotState === TimerState.IDLE || snapshotState == TimerState.FINISHED) {
      return null;
    }
    if (snapshotState === TimerState.ACTIVE) {
      if (!snapshotTimeInfo) {
        throw new Error("timeInfo is null");
      }
      return (snapshotTimeInfo as ActiveTimeInfo).endAt.getTime() - Date.now();
    }
    if (snapshotState === TimerState.PAUSED) {
      if (!snapshotTimeInfo) {
        throw new Error("timeInfo is null");
      }
      return (snapshotTimeInfo as PausedTimeInfo).remainingMilliSec;
    }
  })();

  return {
    state: snapshotState,
    name,
    recipeId,
    totalMilliSec: totalMilliSec,
    // isTimerReserved,
    remainingMilliSec: remainingMilliSec || null,
    manualActions: {
      start,
      pause,
      resume,
      reset,
    },
    autoActions: {
      finish,
    },
  };
}

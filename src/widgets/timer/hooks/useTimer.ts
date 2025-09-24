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
  totalMicroSec: number;
  // isTimerReserved: boolean;
  timeInfo: TimeInfo | null;
  manualActions: {
    start: ({
      recipeId,
      name,
      totalMicroSec,
    }: {
      recipeId: string;
      name: string;
      totalMicroSec: number;
    }) => void;
    /**
     * autoStart는 타이머를 나중에 작동시킬 수 있는 액션.
     * @param name
     * @param recipeId
     * @param totalMicroSec
     * @param startDelay 액션 실행 전 대기 시간
     * @returns
     */
    // reserveStart: (name: string, recipeId: string, totalMicroSec: number, startDelay: number) => void;
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

function convertMicroSecToSeconds(microSec: number): number {
  return microSec / 1000;
}

export function useTimer(): UseTimerReturn {
  const {
    recipeId,
    name,
    totalMicroSec,
    state: snapshotState,
    timeInfo: snapshotTimeInfo,
    capture, //capture 함수는 타이머 상태를 변경하는 함수를 모아둔 객체
  } = useTimerSnapshotStore();

  const { activityActions } = useLiveActivity();

  const { currentAppState, previousAppState } = useAppState();

  // const [isTimerReserved, setIsStartReserved] = useState(false);
  //TODO : 추후 사용 예정
  // const [reservationRemainingMicroSec, setReservationRemainingMicroSec] = useState(0);
  // const timerReservationRef = useRef<number | null>(null);

  const start = useCallback(
    ({
      name,
      recipeId,
      totalMicroSec,
    }: {
      name: string;
      recipeId: string;
      totalMicroSec: number;
    }) => {
      if (snapshotState === TimerState.ACTIVE) return;
      // if(isTimerReserved) return;
      const endAt = new Date(Date.now() + totalMicroSec);
      capture.start({ name, recipeId, totalMicroSec, endAt });
      activityActions.start({
        activityName: name,
        deepLink: `cheiftory://recipe/detail?recipeId=${recipeId}&isTimer=true&title=${name}`,
        endAt,
        totalMicroSec,
      });
      scheduleTimerAlarm(
        name,
        recipeId,
        convertMicroSecToSeconds(totalMicroSec)
      );
    },
    [capture, activityActions, scheduleTimerAlarm]
  );

  //TODO : 추후 사용 예정
  // const scheduleNextTick = (name: string, recipeId: string, totalMicroSec: number) => {
  //   timerReservationRef.current = setTimeout(() => {
  //     setReservationRemainingMicroSec((prev) => {
  //       const newValue = prev - 1000;

  //       if (newValue <= 0) {
  //         setIsStartReserved(false);
  //         start({name, recipeId, totalMicroSec});
  //         return 0;
  //       }

  //       scheduleNextTick(name, recipeId, totalMicroSec); // 다음 실행 예약
  //       return newValue;
  //     });
  //   }, 1000);
  // };

  //TODO : 추후 사용 예정
  // const reserveStart = useCallback(
  //   (name: string, recipeId: string, totalMicroSec: number, startDelay: number) => {
  //     if(snapshotState !== TimerState.IDLE) return;
  //     setIsStartReserved(true);
  //     scheduleNextTick(name, recipeId, totalMicroSec);
  //   },
  //   [start, name, recipeId, totalMicroSec]
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
    const remainingMicroSec =
      (snapshotTimeInfo as ActiveTimeInfo).endAt.getTime() - Date.now();
    capture.pause({ remainingMicroSec });
    activityActions.pause(remainingMicroSec);
    cancelTimerAlarm();
  }, [capture, activityActions, cancelTimerAlarm]);

  const resume = useCallback(() => {
    if (snapshotState !== TimerState.PAUSED) return;
    const remainingMicroSec = (snapshotTimeInfo as PausedTimeInfo)
      .remainingMicroSec;
    const endAt = new Date(Date.now() + remainingMicroSec);
    capture.resume({ endAt });
    activityActions.resume(endAt);
    if (!name || !recipeId) {
      throw new Error("타이머를 재개하려면 레시피 정보가 필수입니다.");
    }
    scheduleTimerAlarm(
      name,
      recipeId,
      convertMicroSecToSeconds(remainingMicroSec)
    );
  }, [capture, activityActions, scheduleTimerAlarm]);

  const finish = useCallback(() => {
    if (
      snapshotState !== TimerState.ACTIVE &&
      snapshotState !== TimerState.PAUSED
    )
      return;
    capture.finish();
    activityActions.end();
  }, [capture, activityActions]);

  const reset = useCallback(() => {
    if (snapshotState === TimerState.IDLE) return;
    capture.reset();

    if (snapshotState === TimerState.FINISHED) return;
    activityActions.end();
    cancelTimerAlarm();
  }, [capture, activityActions, cancelTimerAlarm]);

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

  return {
    state: snapshotState,
    name,
    recipeId,
    totalMicroSec,
    // isTimerReserved,
    timeInfo: snapshotTimeInfo && null,
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

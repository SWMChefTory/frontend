import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureZustandStorage } from "@/src/shared/storage/SecureZustandStorage";

export enum TimerState {
  IDLE = "idle",
  ACTIVE = "active",
  PAUSED = "paused",
  FINISHED = "finished",
}
/**
 * 타이머가 활성 상태일 때의 시간 정보
 */
export interface ActiveTimeInfo {
  endAt: Date;
}

/**
 * 타이머가 일시정지 상태일 때의 시간 정보
 */
export interface PausedTimeInfo {
  pausedAt: Date;
  remainingMicroSec: number;
}

export type TimeInfo = ActiveTimeInfo | PausedTimeInfo;

/**
 * 타이머 시작 시 전달되는 파라미터
 */
interface TimerStartParams {
  name: string;
  recipeId: string;
//   durationMicroSec: number;
totalMicroSec: number;
  endAt: Date;
}

interface TimerPauseParams {
  remainingMicroSec: number;
}

interface TimerResumeParams {
  endAt: Date;
}

interface TimerStoreState {
  state: TimerState;
  recipeId: string | null;
  name: string | null;
  totalMicroSec: number;
  timeInfo: TimeInfo | null;

  capture: {
    start: (params: TimerStartParams) => void;
    pause: (params: TimerPauseParams) => void;
    resume: (params: TimerResumeParams) => void;
    reset: () => void;
    finish: () => void;
  };
}

const useTimerSnapshotStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      state: TimerState.IDLE,
      recipeId: null,
      name: null,
      totalMicroSec: 0,
      timeInfo: null,

      capture: {
        start: ({ name, recipeId, totalMicroSec, endAt }: TimerStartParams) => {
          const { state } = get();
          //타이머가 활성 상태가 아니거나 종료 상태가 아니면 호출 불가
          if (state !== TimerState.IDLE && state !== TimerState.FINISHED)
            return;

          //TODO : 이거 필요한가?
          set({
            state: TimerState.ACTIVE,
            totalMicroSec: totalMicroSec,
            name,
            recipeId,
            timeInfo: {
              endAt: endAt,
            },
          });
        },

        pause: () => {
          const { state } = get();
          if (state !== TimerState.ACTIVE) return;

          const { timeInfo } = get();
          const now = Date.now();
          const remainingMicroSec = (timeInfo as ActiveTimeInfo).endAt.getTime() - now;
          if (remainingMicroSec <= 0) {
            get().capture.finish();
            console.warn("Timer is already finished");
            return;
          }
          set({
            state: TimerState.PAUSED,
            timeInfo: {
              pausedAt: new Date(now),
              remainingMicroSec: remainingMicroSec,
            },
          });
        },

        resume: () => {
          const { state } = get();
          if (state !== TimerState.PAUSED) return;

          const { timeInfo } = get() as { timeInfo: PausedTimeInfo };
          const endMicroSec =
            (timeInfo as PausedTimeInfo).pausedAt.getTime() +
            (timeInfo as PausedTimeInfo).remainingMicroSec;
          if (endMicroSec <= Date.now()) {
            get().capture.finish();
            console.warn("Timer is already finished");
            return;
          }
          set({
            state: TimerState.ACTIVE,
            timeInfo: {
              endAt: new Date(endMicroSec),
            },
          });
        },

        finish: () => {
          const { recipeId, name } = get();
          set({
            state: TimerState.FINISHED,
            timeInfo: null,
            recipeId: recipeId,
            name: name,
          });
        },

        reset: () => {
          set({
            state: TimerState.IDLE,
            timeInfo: null,
            recipeId: null,
            name: null,
          });
        },
      },
    }),
    {
      name: "timer-store",
      storage: createJSONStorage(() => secureZustandStorage),

      //변수만 저장하기 위해 필요
      partialize: (state) => ({
        state: state.state,
        name: state.name,
        recipeId: state.recipeId,
        timeInfo: state.timeInfo,
      }),
    }
  )
);

export default useTimerSnapshotStore;

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
  remainingMilliSec: number;
}

export type TimeInfo = ActiveTimeInfo | PausedTimeInfo;

/**
 * 타이머 시작 시 전달되는 파라미터
 */
interface TimerStartParams {
  name: string;
  recipeId: string;
totalMilliSec: number;
  endAt: Date;
}

interface TimerPauseParams {
  pausedAt: Date;
  remainingMilliSec: number;
}

interface TimerResumeParams {
  endAt: Date;
}

interface TimerStoreState {
  state: TimerState;
  recipeId: string | null;
  name: string | null;
  totalMilliSec: number;
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
      totalMilliSec: 0,
      timeInfo: null,

      capture: {
        start: ({ name, recipeId, totalMilliSec: totalMilliSec, endAt }: TimerStartParams) => {
          const { state } = get();
          //타이머가 활성 상태가 아니거나 종료 상태가 아니면 호출 불가
          if (state !== TimerState.IDLE && state !== TimerState.FINISHED)
            throw new Error("Timer is not idle or finished");

          console.log("[TimerSnapshotStore] start 호출 시, totalMilliSec:", totalMilliSec);
          console.log("[TimerSnapshotStore] start 호출 시, endAt:", endAt);
          set({
            state: TimerState.ACTIVE,
            totalMilliSec,
            name,
            recipeId,
            timeInfo: {
              endAt: endAt,
            },
          });
        },

        pause: ({ pausedAt, remainingMilliSec }: TimerPauseParams) => {
          const { state } = get();
          if (state !== TimerState.ACTIVE) return;

          const { timeInfo } = get();

          if (remainingMilliSec <= 0) {
            get().capture.finish();
            console.warn("Timer is already finished");
            return;
          }
          set({
            state: TimerState.PAUSED,
            timeInfo: {
              pausedAt: pausedAt,
              remainingMilliSec: remainingMilliSec,
            },
          });
        },

        resume: ({ endAt }: TimerResumeParams) => {
          const { state } = get();
          if (state !== TimerState.PAUSED) return;

          if (endAt.getTime() <= Date.now()) {
            get().capture.finish();
            console.warn("Timer is already finished");
            return;
          }
          set({
            state: TimerState.ACTIVE,
            timeInfo: {
              endAt: new Date(endAt),
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

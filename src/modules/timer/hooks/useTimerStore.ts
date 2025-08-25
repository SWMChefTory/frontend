import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureZustandStorage } from "@/src/modules/timer/store/secureZustand";

export enum TimerState {
  IDLE = "idle",
  ACTIVE = "active",
  PAUSED = "paused",
  FINISHED = "finished",
}

export enum TimerStatus {
  NONE = "NONE",
  SAME_RECIPE = "SAME_RECIPE",
  DIFFERENT_RECIPE = "DIFFERENT_RECIPE",
}

export interface TimerStoreState {
  state: TimerState;
  recipeId: string | null;
  name: string | null;
  duration: number;
  remainingTime: number;
  startedAt: number | null;
  pausedAt: number | null;
  deadlineAt: number | null;

  setName: (v: string) => void;
  setRecipeId: (id: string | null) => void;
  setDuration: (sec: number) => void;
  setRemaining: (sec: number) => void;
  getTimerStatus: (recipeId?: string) => TimerStatus;

  start: (params: { name: string; recipeId: string; duration: number }) => void;
  hasActiveTimer: () => boolean;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  finish: () => void;

  isRunning: () => boolean;

  syncAfterRestore: () => void;
}

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      state: TimerState.IDLE,
      name: null,
      duration: 0,
      remainingTime: 0,
      startedAt: null,
      pausedAt: null,
      deadlineAt: null,
      recipeId: null,

      setName: (v) => set({ name: v }),
      setRecipeId: (id) => set({ recipeId: id }),

      setDuration: (sec) => {
        const next = Math.max(0, sec || 0);
        const s = get();
        if (s.state === TimerState.IDLE) {
          set({ duration: next, remainingTime: next });
        } else {
          set({ duration: next });
        }
      },

      setRemaining: (sec) => {
        set({ remainingTime: Math.max(0, sec || 0) });
      },

      getTimerStatus: (recipeId?) => {
        const s = get();

        // 활성 타이머가 없는 경우 (IDLE 상태)
        if (s.state === TimerState.IDLE || !s.recipeId) {
          return TimerStatus.NONE;
        }

        // recipeId가 제공되지 않은 경우, 활성 타이머가 있으므로 DIFFERENT_RECIPE 반환
        if (!recipeId) {
          return TimerStatus.DIFFERENT_RECIPE;
        }

        // 같은 레시피의 타이머가 활성 중인 경우
        if (s.recipeId === recipeId) {
          return TimerStatus.SAME_RECIPE;
        }

        // 다른 레시피의 타이머가 활성 중인 경우
        return TimerStatus.DIFFERENT_RECIPE;
      },

      start: (params) => {
        const now = Date.now();
        const nextDuration = Math.max(0, params.duration);

        set({
          name: params.name,
          recipeId: params.recipeId,
          duration: nextDuration,
          remainingTime: nextDuration,
        });

        if (nextDuration <= 0) {
          set({
            state: TimerState.FINISHED,
            startedAt: null,
            pausedAt: null,
            deadlineAt: null,
            remainingTime: 0,
          });
          return;
        }

        set({
          state: TimerState.ACTIVE,
          startedAt: now,
          pausedAt: null,
          deadlineAt: now + nextDuration * 1000,
          remainingTime: nextDuration,
        });
      },

      pause: () => {
        const now = Date.now();
        const s = get();

        if (s.state !== TimerState.ACTIVE) return;

        let remain = s.remainingTime;
        if (s.deadlineAt) {
          const remainingMs = s.deadlineAt - now;
          remain = Math.max(0, Math.round(remainingMs / 100) / 10);
        }

        set({
          state: TimerState.PAUSED,
          pausedAt: now,
          deadlineAt: null,
          remainingTime: remain,
        });
      },

      resume: () => {
        const now = Date.now();
        const s = get();

        if (s.state !== TimerState.PAUSED) return;

        const remain = Math.max(0, s.remainingTime);
        if (remain <= 0) {
          set({
            state: TimerState.FINISHED,
            startedAt: null,
            pausedAt: null,
            deadlineAt: null,
            remainingTime: 0,
          });
          return;
        }

        set({
          state: TimerState.ACTIVE,
          startedAt: now,
          pausedAt: null,
          deadlineAt: now + remain * 1000,
          remainingTime: remain,
        });
      },

      reset: () => {
        const dur = Math.max(0, get().duration);
        set({
          state: TimerState.IDLE,
          startedAt: null,
          pausedAt: null,
          deadlineAt: null,
          remainingTime: dur,
          recipeId: null,
          name: null,
        });
      },

      isRunning: () => get().state === TimerState.ACTIVE,

      finish: () => {
        set({
          state: TimerState.FINISHED,
          startedAt: null,
          pausedAt: null,
          deadlineAt: null,
          remainingTime: 0,
        });
      },

      syncAfterRestore: () => {
        const s = get();
        const now = Date.now();

        if (s.state === TimerState.ACTIVE && s.deadlineAt) {
          const remainingMs = s.deadlineAt - now;

          if (remainingMs <= 0) {
            set({
              state: TimerState.FINISHED,
              startedAt: null,
              pausedAt: null,
              deadlineAt: null,
              remainingTime: 0,
            });
          } else {
            const remainingSec = Math.round(remainingMs / 100) / 10;
            set({ remainingTime: remainingSec });
          }
        }
      },
      hasActiveTimer: () => {
        const s = get();
        return s.state === TimerState.ACTIVE && s.deadlineAt !== null;
      },
    }),
    {
      name: "timer-store",
      storage: createJSONStorage(() => secureZustandStorage),

      partialize: (state) => ({
        state: state.state,
        name: state.name,
        duration: state.duration,
        remainingTime: state.remainingTime,
        startedAt: state.startedAt,
        pausedAt: state.pausedAt,
        deadlineAt: state.deadlineAt,
        recipeId: state.recipeId,
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.syncAfterRestore();
        }
      },
    },
  ),
);

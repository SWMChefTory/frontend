import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureZustandStorage } from "@/src/modules/timer/store/secureZustand";

export enum TimerState {
  IDLE = "idle",
  ACTIVE = "active",
  PAUSED = "paused",
  FINISHED = "finished",
}

export interface TimerStoreState {
  state: TimerState;
  name: string;
  duration: number;
  remainingTime: number;
  startedAt: number | null;
  pausedAt: number | null;
  deadlineAt: number | null;

  setName: (v: string) => void;
  setDuration: (sec: number) => void;
  setRemaining: (sec: number) => void;

  start: () => void;
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
      name: "",
      duration: 0,
      remainingTime: 0,
      startedAt: null,
      pausedAt: null,
      deadlineAt: null,

      setName: (v) => set({ name: v }),

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

      start: () => {
        const now = Date.now();
        const s = get();
        const dur = Math.max(0, s.duration);
        const baseRemain = Math.max(
          0,
          s.remainingTime > 0 ? s.remainingTime : dur,
        );

        if (baseRemain <= 0) {
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
          deadlineAt: now + baseRemain * 1000,
          remainingTime: baseRemain,
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
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.syncAfterRestore();
        }
      },
    },
  ),
);

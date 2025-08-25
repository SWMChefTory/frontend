import {
  TimerState,
  TimerStatus,
  useTimerStore,
} from "@/src/modules/timer/hooks/useTimerStore";
import { useAppState } from "@/src/modules/timer/hooks/useAppState";
import { useCallback, useEffect, useRef } from "react";

export interface UseCountdownTimerReturn {
  state: TimerState;
  start: (params: { name: string; recipeId: string; duration: number }) => void;
  getRemainingTime: () => number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  isRunning: () => boolean;
  name: string | null;
  recipeId: string | null;
  setDuration: (newDuration: number) => void;
  getTimerStatus: (recipeId?: string) => TimerStatus;
  getLivePayload: () => {
    startedAt: number | null;
    pausedAt: number | null;
    duration: number;
    remainingTime: number;
    name: string;
  };
}

export function useCountdownTimer(): UseCountdownTimerReturn {
  const state = useTimerStore((store) => store.state);
  const name = useTimerStore((store) => store.name);
  const recipeId = useTimerStore((store) => store.recipeId);
  const getTimerStatus = useTimerStore((store) => store.getTimerStatus);
  const setDuration = useTimerStore((store) => store.setDuration);
  const storeStart = useTimerStore((store) => store.start);
  const storePause = useTimerStore((store) => store.pause);
  const storeResume = useTimerStore((store) => store.resume);
  const storeReset = useTimerStore((store) => store.reset);
  const isRunning = useTimerStore((store) => store.isRunning);

  const { currentAppState, previousAppState } = useAppState();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTicker = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const tick = useCallback(() => {
    const s = useTimerStore.getState();
    if (s.state !== TimerState.ACTIVE || !s.deadlineAt) return;

    const remainingMs = s.deadlineAt - Date.now();
    const next = remainingMs <= 0 ? 0 : Math.round(remainingMs / 100) / 10;

    s.setRemaining(next);

    if (next <= 0) {
      clearTicker();
      s.finish();
    }
  }, []);

  useEffect(() => {
    if (state === TimerState.ACTIVE && !timerRef.current) {
      timerRef.current = setInterval(tick, 100);
    } else if (state !== TimerState.ACTIVE && timerRef.current) {
      clearTicker();
    }
    return clearTicker;
  }, [state]);

  useEffect(() => {
    if (currentAppState !== previousAppState) {
      tick();
    }
  }, [currentAppState, previousAppState]);

  const start = useCallback(
    ({
      name,
      recipeId,
      duration: newDuration,
    }: {
      name: string;
      recipeId: string;
      duration: number;
    }) => {
      storeStart({
        name,
        recipeId,
        duration: newDuration,
      });
    },
    [storeStart],
  );

  const getLivePayload = useCallback(() => {
    const s = useTimerStore.getState();
    const name = s.name || "";
    return {
      startedAt: s.startedAt,
      pausedAt: s.pausedAt,
      duration: s.duration,
      remainingTime: s.remainingTime,
      name: name,
    };
  }, []);

  const getRemainingTime = useCallback(() => {
    const s = useTimerStore.getState();
    return s.remainingTime;
  }, []);

  return {
    state,
    start,
    getTimerStatus,
    getRemainingTime,
    name,
    recipeId,
    pause: storePause,
    resume: storeResume,
    reset: storeReset,
    isRunning,
    setDuration,
    getLivePayload,
  };
}

export function useCountdownTimerState(): {
  state: TimerState;
  remainingTime: number;
  duration: number;
} {
  const { state, remainingTime, duration } = useTimerStore();
  return { state, remainingTime, duration };
}

export function useHasActiveTimer(): boolean {
  const hasActiveTimer = useTimerStore((store) => store.hasActiveTimer);
  return hasActiveTimer();
}

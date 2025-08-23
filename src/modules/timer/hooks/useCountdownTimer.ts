import { useCallback, useEffect, useRef } from "react";
import { TimerState, useTimerStore } from "./useTimerStore";
import { useAppState } from "@/src/modules/timer/hooks/useAppState";

export interface UseCountdownTimerOptions {
  onComplete?: () => void;
  name?: string;
}

export interface UseCountdownTimerReturn {
  remainingTime: number;
  state: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  duration: number;
  isRunning: () => boolean;
  setDuration: (newDuration: number) => void;
  getLivePayload: () => {
    startedAt: number | null;
    pausedAt: number | null;
    duration: number;
    remainingTime: number;
    name: string;
  };
}

export function useCountdownTimer({
  onComplete,
  name,
}: UseCountdownTimerOptions): UseCountdownTimerReturn {
  const {
    state,
    duration,
    setName,
    remainingTime,
    setDuration,
    start: storeStart,
    pause: storePause,
    resume: storeResume,
    reset: storeReset,
    finish: storeFinish,
    isRunning,
  } = useTimerStore();

  const { currentAppState, previousAppState } = useAppState();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (name) setName(name);
  }, [name, setName]);

  const clearTicker = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const tick = useCallback(() => {
    const s = useTimerStore.getState();
    if (s.state !== TimerState.ACTIVE || !s.deadlineAt) return;

    const remainingMs = Math.max(0, s.deadlineAt - Date.now());
    const next = Math.round(remainingMs / 100) / 10;

    if (Math.abs(next - s.remainingTime) >= 0.1) {
      s.setRemaining(next);
    }

    if (next <= 0) {
      clearTicker();
      storeFinish();
      onComplete?.();
    }
  }, [onComplete, storeFinish]);

  useEffect(() => {
    if (state === TimerState.ACTIVE && !timerRef.current) {
      timerRef.current = setInterval(tick, 100);
    } else if (state !== TimerState.ACTIVE && timerRef.current) {
      clearTicker();
    }
    return clearTicker;
  }, [state, tick]);

  useEffect(() => {
    if (currentAppState !== previousAppState) {
      tick();
    }
  }, [currentAppState, previousAppState, tick]);

  const start = useCallback(() => {
    const s = useTimerStore.getState();
    if (s.state === TimerState.IDLE && s.remainingTime <= 0) {
      s.setRemaining(Math.max(0, Math.floor(s.duration)));
    }
    storeStart();
  }, [storeStart]);

  const getLivePayload = () => {
    const s = useTimerStore.getState();
    let remainingTime = Math.max(0, s.remainingTime);

    if (s.state === TimerState.ACTIVE && s.deadlineAt) {
      const remainingMs = s.deadlineAt - Date.now();
      remainingTime = Math.max(0, Math.round(remainingMs / 100) / 10);
    }

    return {
      startedAt: s.startedAt,
      pausedAt: s.pausedAt,
      duration: Math.max(0, s.duration),
      remainingTime,
      name: s.name,
    };
  };

  return {
    remainingTime,
    state,
    start,
    pause: storePause,
    resume: storeResume,
    reset: storeReset,
    duration,
    isRunning,
    setDuration,
    getLivePayload,
  };
}

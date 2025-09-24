// hooks/useLiveActivity.ts (슬림)
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";
import * as liveActivities from "@/modules/expo-live-activity";

export function useLiveActivity() {
  const isIOS = Platform.OS === "ios";
  const isSupported = useMemo(() => {
    if (!isIOS) return false;
    const v =
      typeof Platform.Version === "string"
        ? parseInt(Platform.Version as string, 10)
        : Number(Platform.Version);
    return v >= 16.2;
  }, [isIOS]);

  const isLiveActivityAvailable =
    isIOS && isSupported && liveActivities.isLiveActivityAvailable?.();

  const { liveActivityId, setLiveActivityId } = useLiveActivityStore();

  const start = useCallback(
    async (opts: {
      activityName: string;
      endAt?: Date;
      totalMicroSec?: number;
      deepLink: string;
    }) => {
      if (!isLiveActivityAvailable) return null;
      if(liveActivityId) return null;
      const id = await liveActivities.startLiveActivity(
        opts.activityName,
        opts.endAt ?? new Date(),
        opts.totalMicroSec ?? 0,
        opts.deepLink,
      );
      if (id) setLiveActivityId(id);
    },
    [isLiveActivityAvailable],
  );

  const pause = useCallback(
    async (
        // activityId: string,
        remainingMicroSec: number,
    ) => {
      if (!isLiveActivityAvailable || !liveActivityId) return false;
      await liveActivities.pauseLiveActivity(liveActivityId, remainingMicroSec);
    },
    [isLiveActivityAvailable, liveActivityId],
  );

  const resume = useCallback(
    async (
        endAt: Date,
    ) => {
      if (!isLiveActivityAvailable || !liveActivityId) return false;
      await liveActivities.resumeLiveActivity(liveActivityId, endAt);
    },
    [isLiveActivityAvailable, liveActivityId],
  );

  const end = useCallback(async () => {
    if (!isLiveActivityAvailable || !liveActivityId) return false;
    const ok = await liveActivities.endLiveActivity(liveActivityId);
    if (ok) setLiveActivityId(null);
    return ok;
  }, [isLiveActivityAvailable, liveActivityId]);

  return {
    isSupported,
    isLiveActivityAvailable, //isSupported와 isLiveActivity 합치기
    isStartAvailable: liveActivityId === null,
    activityActions: {
      start,
      pause,
      resume,
      end,
    },
  };
}

export type LiveActivityPayload = {
  startedAt: number | null;
  pausedAt: number | null;
  duration: number;
  remainingTime: number;
};

// stores/useLiveActivityStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {secureZustandStorage, SecureZustandStorageName} from "@/src/shared/storage/SecureZustandStorage";

type LiveActivityStore = {
  liveActivityId: string | null;
  setLiveActivityId: (id: string | null) => void;
};

const useLiveActivityStore = create<LiveActivityStore>()(
  persist(
    (set) => ({
      liveActivityId: null,
      setLiveActivityId: (id) => set({ liveActivityId: id }),
    }),
    {
      name: SecureZustandStorageName.LIVE_ACTIVITY_STORE,
      storage: createJSONStorage(() => secureZustandStorage),
    },
  ),
);
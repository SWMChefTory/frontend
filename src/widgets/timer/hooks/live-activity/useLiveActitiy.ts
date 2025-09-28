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
      endAt: Date;
      totalMilliSec?: number;
      deepLink: string;
    }) => {
      console.log("[LiveActivity] start 호출 시, isLiveActivityAvailable:", isLiveActivityAvailable);
      if (!isLiveActivityAvailable) return null;
      if(liveActivityId) {
        setLiveActivityId(null);
        throw new Error("LiveActivity already started");
      }
      console.log("[LiveActivity] start 호출 시, liveActivityId:", liveActivityId);
      const id = await liveActivities.startLiveActivity(
        opts.activityName,
        opts.endAt,
        opts.totalMilliSec ?? 0,
        opts.deepLink,
      );
      console.log("[LiveActivity] start 호출 시, id:", id);
      if (id) setLiveActivityId(id);
    },
    [isLiveActivityAvailable, liveActivityId],
  );

  const pause = useCallback(
    async (
        // activityId: string,
        pausedAt: Date,
        remainingMilliSec: number,
    ) => {
      if (!isLiveActivityAvailable || !liveActivityId) return false;
      await liveActivities.pauseLiveActivity(liveActivityId, pausedAt, remainingMilliSec);
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
    if (!isLiveActivityAvailable) return false;
    if (liveActivityId){
      setLiveActivityId(null);
      return await liveActivities.endLiveActivity(liveActivityId);
    }
    return false;
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
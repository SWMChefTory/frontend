// hooks/useLiveActivity.ts (슬림)
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";
import * as liveActivities from "@/modules/expo-live-activity";
import { useLiveActivityStore } from "@/src/modules/timer/hooks/useLiveActivityStore";

export type LiveActivityPayload = {
  startedAt: number | null;
  pausedAt: number | null;
  duration: number;
  remainingTime: number;
};

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

  const startActivity = useCallback(
    async (opts: {
      activityName: string;
      duration?: number;
      deepLink: string;
    }) => {
      if (!isLiveActivityAvailable) return null;
      const id = await liveActivities.startLiveActivity(
        opts.activityName,
        opts.duration ?? 0,
        opts.deepLink,
      );
      if (id) setLiveActivityId(id);
      return id;
    },
    [isLiveActivityAvailable],
  );

  const pauseActivity = useCallback(
    async (payload: {
      startedAt: number | null;
      pausedAt: number | null;
      duration: number;
      remainingTime: number;
    }) => {
      if (!isLiveActivityAvailable || !liveActivityId) return false;
      await liveActivities.pauseLiveActivity(liveActivityId);
      return await liveActivities.updateLiveActivityPayload(
        liveActivityId,
        payload,
      );
    },
    [isLiveActivityAvailable, liveActivityId],
  );

  const resumeActivity = useCallback(
    async (payload: {
      startedAt: number | null;
      pausedAt: number | null;
      duration: number;
      remainingTime: number;
    }) => {
      if (!isLiveActivityAvailable || !liveActivityId) return false;
      await liveActivities.updateLiveActivityPayload(liveActivityId, payload);
      return await liveActivities.resumeLiveActivity(liveActivityId);
    },
    [isLiveActivityAvailable, liveActivityId],
  );

  const endActivity = useCallback(async () => {
    if (!isLiveActivityAvailable || !liveActivityId) return false;
    const ok = await liveActivities.endLiveActivity(liveActivityId);
    if (ok) setLiveActivityId(null);
    return ok;
  }, [isLiveActivityAvailable, liveActivityId]);

  return {
    isSupported,
    isLiveActivityAvailable,
    liveActivityId,
    startActivity,
    pauseActivity,
    resumeActivity,
    endActivity,
  };
}

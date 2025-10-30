// hooks/useLiveActivity.ts (슬림)
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureZustandStorage } from "@/src/pages/webview/timer/live-activity/secureStorage";
import { Platform } from "react-native";
import * as liveActivities from "@/modules/expo-live-activity";

type LiveActivityStore = {
  timerIdActivityIdMap: Map<string, string>;
  addLiveActivityId: (recipeId: string, activityId: string) => void;
  getLiveActivityId: (timerId: string) => string | null;
  clearInvalidTimerId: (validTimerIds: string[]) => void;
  removeTimerId: (timerId: string) => void;
};

const liveActivityStore = create<LiveActivityStore>()(
  persist(
    (set, get) => ({
      timerIdActivityIdMap: new Map(),
      addLiveActivityId: (recipeId, activityId) => {
        set({
          timerIdActivityIdMap: new Map([
            ...get().timerIdActivityIdMap,
            [recipeId, activityId],
          ]),
        });
      },
      clearInvalidTimerId: (validTimerIds: string[]) => {
        set({
          timerIdActivityIdMap: new Map([
            ...get()
              .timerIdActivityIdMap.entries()
              .filter(([timerId, activityId]) =>
                validTimerIds.includes(timerId)
              ),
          ]),
        });
      },
      getLiveActivityId: (timerId) =>
        get().timerIdActivityIdMap.get(timerId) ?? null,
      removeTimerId: (timerId) =>
        set({
          timerIdActivityIdMap: (() => {
            const map = new Map(get().timerIdActivityIdMap);
            map.delete(timerId);
            return map;
          })(),
        }),
    }),
    {
      name: "cheftory.liveactivity.id",
      storage: createJSONStorage(() => secureZustandStorage),
      partialize: (state) => ({
        timerIdActivityIdMap: Array.from(state.timerIdActivityIdMap.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.timerIdActivityIdMap)) {
          state.timerIdActivityIdMap = new Map(
            state.timerIdActivityIdMap as [string, string][]
          );
        } else {
          console.log("복구 실패");
        }
      },
    }
  )
);

const isIOS = Platform.OS === "ios";
const version = (() => {
  return typeof Platform.Version === "string"
    ? parseInt(Platform.Version as string, 10)
    : Number(Platform.Version);
})();
const isLiveActivityAvailable =
  isIOS && version >= 16.2 && liveActivities.isLiveActivityAvailable?.();

const startActivity = async (opts: {
  timerId: string;
  activityName: string;
  endAt: number;
  recipeId: string;
  validTimerIds?: string[];
}) => {
  const duration = Math.ceil((opts.endAt - Date.now()) / 1000);

  const deepLinkUrl = `cheftory://?recipeId=${opts.recipeId}`;

  if (!isLiveActivityAvailable) return null;
  if (duration <= 0) throw new Error("Duration은 0보다 커야 합니다.");
  if (opts.validTimerIds)
    liveActivityStore.getState().clearInvalidTimerId(opts.validTimerIds);
  const id = await liveActivities.startLiveActivity(
    opts.activityName,
    duration,
    deepLinkUrl
  );
  if (id) liveActivityStore.getState().addLiveActivityId(opts.timerId, id);
  return id;
};

const pauseActivity = async (payload: {
  timerId: string;
  startedAt: number | null;
  pausedAt: number | null;
  duration: number;
  remainingTime: number;
}) => {
  const liveActivityId = liveActivityStore
    .getState()
    .getLiveActivityId(payload.timerId);

  if (!isLiveActivityAvailable || !liveActivityId) return false;
  await liveActivities.pauseLiveActivity(liveActivityId);
  return await liveActivities.updateLiveActivityPayload(
    liveActivityId,
    payload
  );
};

const resumeActivity = async (payload: {
  timerId: string;
  startedAt: number;
  duration: number;
  endAt: number;
}) => {
  const remainingTime = Math.ceil((payload.endAt - payload.startedAt) / 1000);
  const liveActivityId = liveActivityStore
    .getState()
    .getLiveActivityId(payload.timerId);
  if (!isLiveActivityAvailable || !liveActivityId) return false;
  await liveActivities.updateLiveActivityPayload(liveActivityId, {
    startedAt: payload.startedAt,
    pausedAt: null,
    duration: payload.duration,
    remainingTime: remainingTime,
  });
  return await liveActivities.resumeLiveActivity(liveActivityId);
};

const endActivity = async ({ timerId }: { timerId: string }) => {
  const liveActivityId = liveActivityStore
    .getState()
    .getLiveActivityId(timerId);
  if (!isLiveActivityAvailable || !liveActivityId) return false;
  await liveActivities.endLiveActivity(liveActivityId);
  liveActivityStore.getState().removeTimerId(timerId);
  return true;
};

export { startActivity, pauseActivity, resumeActivity, endActivity };

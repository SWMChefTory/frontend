import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";


type LiveActivityPayload = {
  startedAt: number | null;
  pausedAt: number | null;
  duration: number;
  remainingTime: number;
};


type ExpoLiveActivityModule = {
  isLiveActivityAvailable: () => boolean;
  startActivity: (
    activityName: string,
    duration: number,
    deepLink: string,
  ) => Promise<string>;
  pauseActivity: (activityId?: string) => Promise<boolean>;
  resumeActivity: (activityId?: string) => Promise<boolean>;
  endActivity: (activityId?: string) => Promise<boolean>;
  updatePayload: (
    activityId: string,
    payload: LiveActivityPayload,
  ) => Promise<boolean>;
};

let ExpoLiveActivity: ExpoLiveActivityModule | null = null;

if (Platform.OS === "ios") {
  ExpoLiveActivity = requireNativeModule("ExpoLiveActivity");
}

export type TimerState = "active" | "paused" | "finished";

export function isLiveActivityAvailable(): boolean {  
  if (!ExpoLiveActivity) return false;

  try {
    return ExpoLiveActivity.isLiveActivityAvailable();
  } catch (error) {
    console.error("[LiveActivities] Error checking availability:", error);
    return false;
  }
}

export async function startLiveActivity(
  activityName: string,
  duration: number,
  deepLink: string,
): Promise<string> {
  if (!ExpoLiveActivity) {
    console.warn("[LiveActivities] Module not available.");
    return "";
  }

  try {
    return await ExpoLiveActivity.startActivity(
      activityName,
      duration,
      deepLink,
    );
  } catch (error) {
    console.error("[LiveActivities] Error starting activity:", error);
    return "";
  }
}

export async function pauseLiveActivity(activityId: string): Promise<boolean> {
  if (!ExpoLiveActivity) return false;

  try {
    return await ExpoLiveActivity.pauseActivity(activityId);
  } catch (error) {
    console.error("[LiveActivities] Error pausing activity:", error);
    return false;
  }
}

export async function resumeLiveActivity(activityId: string): Promise<boolean> {
  if (!ExpoLiveActivity) return false;

  try {
    return await ExpoLiveActivity.resumeActivity(activityId);
  } catch (error) {
    console.error("[LiveActivities] Error resuming activity:", error);
    return false;
  }
}

export async function endLiveActivity(activityId: string): Promise<boolean> {
  if (!ExpoLiveActivity) return false;

  try {
    return await ExpoLiveActivity.endActivity(activityId);
  } catch (error) {
    console.error("[LiveActivities] Error ending activity:", error);
    return false;
  }
}

export async function updateLiveActivityPayload(
  activityId: string,
  payload: LiveActivityPayload,
): Promise<boolean> {
  if (!ExpoLiveActivity) return false;
  console.log("updateLiveActivityPayload", activityId, JSON.stringify(payload));
  try {
    return await ExpoLiveActivity.updatePayload(activityId, payload);
  } catch (error) {
    console.error("[LiveActivities] Error updating activity payload:", error);
    return false;
  }
}

export default {
  isLiveActivityAvailable,
  startLiveActivity,
  pauseLiveActivity,
  resumeLiveActivity,
  endLiveActivity,
};

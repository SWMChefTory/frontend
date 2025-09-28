import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

type ExpoLiveActivityModule = {
  isLiveActivityAvailable: () => boolean;
  startActivity: (
    activityName: string,
    endAtMilliSec: number,
    totalMilliSec: number,
    deepLink: string,
  ) => Promise<string>;
  pauseActivity: (activityId?: string, pausedAtMilliSec?: number, remainingSeconds?: number) => Promise<boolean>;
  resumeActivity: (activityId?: string, endAt?: number) => Promise<boolean>;
  endActivity: (activityId?: string) => Promise<boolean>; 
};

let ExpoLiveActivity: ExpoLiveActivityModule | null = null;

if (Platform.OS === "ios") {
  ExpoLiveActivity = requireNativeModule("ExpoLiveActivity");
}

export type TimerState = "active" | "paused" | "finished";

function convertMilliSecToSeconds(milliSec: number): number {
  return milliSec / 1000;
}

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
  endAt: Date,
  totalMilliSec: number,
  deepLink: string,
): Promise<string> {
  if (!ExpoLiveActivity) {
    console.warn("[LiveActivities] Module not available.");
    return "";
  }


  console.log("[LiveActivities] Starting activity:", activityName, endAt, totalMilliSec, deepLink);
  console.log("[LiveActivities] endAt:", endAt);

  try {
    const totalSeconds = convertMilliSecToSeconds(totalMilliSec);
    return await ExpoLiveActivity.startActivity(
      activityName,
      endAt.getTime(),
      totalSeconds,
      deepLink,
    );
  } catch (error) {
    console.error("[LiveActivities] Error starting activity:", error);
    return "";
  }
}

export async function pauseLiveActivity(activityId: string, pausedAt: Date, remainingMilliSec: number): Promise<boolean> {
  if (!ExpoLiveActivity) return false;
  try {
    const remainingSeconds = convertMilliSecToSeconds(remainingMilliSec);
    return await ExpoLiveActivity.pauseActivity(activityId, pausedAt.getTime(), remainingSeconds);
  } catch (error) {
    console.error("[LiveActivities] Error pausing activity:", error);
    return false;
  }
}

export async function resumeLiveActivity(activityId: string, endAt: Date): Promise<boolean> {
  if (!ExpoLiveActivity) return false;

  try {
    return await ExpoLiveActivity.resumeActivity(activityId, endAt.getTime());
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

export default {
  isLiveActivityAvailable,
  startLiveActivity,
  pauseLiveActivity,
  resumeLiveActivity,
  endLiveActivity,
};

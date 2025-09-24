import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

type ExpoLiveActivityModule = {
  isLiveActivityAvailable: () => boolean;
  startActivity: (
    activityName: string,
    endAt: Date,
    totalMicroSec: number,
    deepLink: string,
  ) => Promise<string>;
  pauseActivity: (activityId?: string, remainingSeconds?: number) => Promise<boolean>;
  resumeActivity: (activityId?: string, endAt?: Date) => Promise<boolean>;
  endActivity: (activityId?: string) => Promise<boolean>; 
};

let ExpoLiveActivity: ExpoLiveActivityModule | null = null;

if (Platform.OS === "ios") {
  ExpoLiveActivity = requireNativeModule("ExpoLiveActivity");
}

export type TimerState = "active" | "paused" | "finished";

function convertMicroSecToSeconds(microSec: number): number {
  return microSec / 1000;
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
  totalMicroSec: number,
  deepLink: string,
): Promise<string> {
  if (!ExpoLiveActivity) {
    console.warn("[LiveActivities] Module not available.");
    return "";
  }

  try {
    const totalSeconds = convertMicroSecToSeconds(totalMicroSec);
    return await ExpoLiveActivity.startActivity(
      activityName,
      endAt,
      totalSeconds,
      deepLink,
    );
  } catch (error) {
    console.error("[LiveActivities] Error starting activity:", error);
    return "";
  }
}

export async function pauseLiveActivity(activityId: string, remainingMicroSec: number): Promise<boolean> {
  if (!ExpoLiveActivity) return false;
  try {
    const remainingSeconds = convertMicroSecToSeconds(remainingMicroSec);
    return await ExpoLiveActivity.pauseActivity(activityId, remainingSeconds);
  } catch (error) {
    console.error("[LiveActivities] Error pausing activity:", error);
    return false;
  }
}

export async function resumeLiveActivity(activityId: string, endAt: Date): Promise<boolean> {
  if (!ExpoLiveActivity) return false;

  try {
    return await ExpoLiveActivity.resumeActivity(activityId, endAt);
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

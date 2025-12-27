import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";
import type { Market } from "@/src/modules/shared/types/market";

const ANDROID_CHANNEL_ID = "timer-alarms";

const TIMER_TEXT = {
  KOREA: {
    title: "타이머 완료!",
    body: (recipeTitle: string) => `${recipeTitle} 타이머가 끝났어요.`,
  },
  GLOBAL: {
    title: "Timer Complete!",
    body: (recipeTitle: string) => `${recipeTitle} timer has finished.`,
  },
} as const;

export async function cancelTimerAlarm({
  timerId,
}: {
  timerId: string;
}): Promise<void> {
  try {
    console.log("취소!!!!!!!!!!!!!!!!!!!!!!!!!!");
    await Notifications.cancelScheduledNotificationAsync(timerId);
  } catch (error) {
    console.warn("예약된 타이머 알림 취소 실패:", error);
  }
}

export async function tryGrantPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") {
    return true;
  }
  const result = await Notifications.requestPermissionsAsync();
  if (result.status === "granted") {
    return true;
  }
  return false;
}

export async function scheduleTimerAlarm(
  timerId: string,
  recipeId: string,
  recipeTitle: string,
  remainingSeconds: number,
  market: Market | null,
) {
  if (!tryGrantPermission()) {
    return;
  }
  const currentMarket = market === "GLOBAL" ? "GLOBAL" : "KOREA";
  const text = TIMER_TEXT[currentMarket];

  return await Notifications.scheduleNotificationAsync({
    identifier: timerId,
    content: {
      title: text.title,
      body: text.body(recipeTitle),
      sound: true,
      data: {
        type: "timer",
        url: `cheftory://?${"recipeId=" + recipeId}`,
        scheduledAt: Date.now(),
        duration: Math.max(1, remainingSeconds),
      },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.floor(Math.max(1, remainingSeconds))),
      channelId: Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
    },
  });
}

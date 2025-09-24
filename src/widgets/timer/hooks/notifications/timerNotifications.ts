import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";

const ANDROID_CHANNEL_ID = "timer-alarms";
const TIMER_NOTIFICATION_ID = "timer-current";

export async function cancelTimerAlarm(): Promise<void> {
  try {
    console.log("예약된 타이머 알림 취소 시도");
    await Notifications.cancelScheduledNotificationAsync(TIMER_NOTIFICATION_ID);
  } catch (error) {
    console.warn("예약된 타이머 알림 취소 실패:", error);
  }
}

export async function scheduleTimerAlarm(
  recipeTitle: string,
  recipeId: string,
  remainingSeconds: number,
) {
  return await Notifications.scheduleNotificationAsync({
    identifier: TIMER_NOTIFICATION_ID,
    content: {
      title: "타이머 완료!",
      body: `${recipeTitle} 타이머가 끝났어요.`,
      sound: true,
      data: {
        type: "timer",
        url: `cheiftory://recipe/detail?recipeId=${recipeId}&isTimer=true&title=${recipeTitle}`,
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

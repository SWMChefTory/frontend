import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";

const ANDROID_CHANNEL_ID = "timer-alarms";

export async function ensureNotificationReady() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Timer Alarms",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      bypassDnd: false,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    const req = await Notifications.requestPermissionsAsync();
    if (!req.granted) {
      throw new Error("알림 권한이 거부되었습니다.");
    }
  }
}

export async function cancelTimerAlarm({timerId}: {timerId: string}): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(timerId);
  } catch (error) {
    console.warn("예약된 타이머 알림 취소 실패:", error);
  }
}

export async function scheduleTimerAlarm(
  timerId: string,
  recipeId: string,
  recipeTitle: string,
  remainingSeconds: number,
) {
  return await Notifications.scheduleNotificationAsync({
    identifier: timerId,
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

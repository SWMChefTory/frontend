import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";

const ANDROID_CHANNEL_ID = "timer-alarms";
const TIMER_NOTIFICATION_ID = "timer-current";

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

export type TimerAlarmParams = {
  title: string;
  body: string;
  deepLink: string;
  secondsFromNow: number;
};

export async function scheduleTimerAlarm(
  params: TimerAlarmParams,
): Promise<string> {
  const { title, body, deepLink, secondsFromNow } = params;

  await cancelTimerAlarm();

  return await Notifications.scheduleNotificationAsync({
    identifier: TIMER_NOTIFICATION_ID,
    content: {
      title,
      body,
      sound: true,
      data: {
        type: "timer",
        url: deepLink,
        scheduledAt: Date.now(),
        duration: secondsFromNow,
      },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.floor(secondsFromNow)),
      channelId: Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
    },
  });
}

export async function cancelTimerAlarm(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(TIMER_NOTIFICATION_ID);
  } catch (error) {
    console.warn("예약된 타이머 알림 취소 실패:", error);
  }
}

export async function scheduleTimerNotification(
  recipeTitle: string,
  recipeId: string,
  remainingSeconds: number,
) {
  await cancelTimerAlarm();
  await scheduleTimerAlarm({
    title: "타이머 완료!",
    body: `${recipeTitle} 타이머가 끝났어요.`,
    secondsFromNow: Math.max(1, remainingSeconds),
    deepLink: `cheiftory://recipe/detail?recipeId=${recipeId}&isTimer=true&title=${recipeTitle}`,
  });
}

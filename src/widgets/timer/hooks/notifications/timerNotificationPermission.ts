import * as Notifications from "expo-notifications";
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
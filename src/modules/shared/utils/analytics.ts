import { Platform } from "react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserProperty,
} from "@react-native-firebase/analytics";

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

function getAnalyticsInstance() {
  if (Platform.OS === "web") return null;
  if (!analyticsInstance) {
    const app = getApp();
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
}

export const track = {
  screen: (name: string) => {
    const a = getAnalyticsInstance();
    if (!a) return;
    logScreenView(a, { screen_name: name, screen_class: name } as any);
  },
  event: (name: string, params?: Record<string, any>) => {
    const a = getAnalyticsInstance();
    if (!a) return;
    logEvent(a, name as any, params);
  },
  userProp: (name: string, value: string) => {
    const a = getAnalyticsInstance();
    if (!a) return;
    setUserProperty(a, name, value);
  },
};
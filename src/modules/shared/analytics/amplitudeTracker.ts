import { track } from "@amplitude/analytics-react-native";
import { Platform } from "react-native";

// Native에서 직접 호출하는 이벤트 추적
export const trackNative = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  track(eventName, {
    ...properties,
    source: "native",
    platform: Platform.OS,
  });
};

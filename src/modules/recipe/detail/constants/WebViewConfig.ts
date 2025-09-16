import { Platform } from "react-native";

export const WEBVIEW_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_WEBVIEW_URL,
  USER_AGENTS: {
    IOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    ANDROID:
      "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
  },
} as const;

export const getUserAgent = (): string => {
  return Platform.OS === "ios"
    ? WEBVIEW_CONFIG.USER_AGENTS.IOS
    : WEBVIEW_CONFIG.USER_AGENTS.ANDROID;
};

export const getWebViewUrl = (recipeId: string): string => {
  return `${WEBVIEW_CONFIG.BASE_URL}/#/recipes/${recipeId}`;
};

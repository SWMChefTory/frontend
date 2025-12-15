import { refreshToken } from "@/src/modules/shared/api/client";
import { Action, WebViewMessageType } from "@/src/shared/webview/messageType";
import { useCreatingCategoryViewStore } from "@/src/widgets/create-category-view/store/creatingCategoryView";
import {
  useLogoutViewModel,
  useDeleteUserViewModel,
} from "@/src/modules/user/business/service/useAuthService";
import {
  scheduleTimerAlarm,
  cancelTimerAlarm,
} from "@/src/pages/webview/timer/notifications/timerNotifications";
import {
  startActivity,
  pauseActivity,
  resumeActivity,
  endActivity,
} from "@/src/pages/webview/timer/live-activity/liveActivity";
import { trackFromWebView } from "@/src/modules/shared/analytics";
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import { Alert, Linking, Platform } from "react-native";
import { comsumeReservedMessage } from "@/src/shared/webview/sendMessage";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeArea } from "../RecipeWebView";
//webview입장에서 요청
type RequestMsgBlockingFromWebView = {
  intended: true;
  action: Action.REQUEST;
  mode: WebViewMessageType.BLOCKING;
  id: string;
  type: string;
  payload?: any;
};

type RequestMsgUnblockingFromWebView = {
  intended: true;
  action: Action.REQUEST;
  mode: WebViewMessageType.UNBLOCKING;
  type: string;
  payload?: any;
};

const createReplyResponse = <T>(id: string, result: T) => {
  return {
    intended: true,
    action: Action.RESPONSE,
    id,
    ok: true,
    result,
    mode: WebViewMessageType.BLOCKING,
  };
};

const createFailResponse = (id: string, error: string) => {
  return {
    intended: true,
    action: Action.RESPONSE,
    id,
    ok: false,
    result: error,
    mode: WebViewMessageType.BLOCKING,
  };
};

enum payloadType {
  CONSUME_INITIAL_DATA = "CONSUME_INITIAL_DATA",
  LOAD_START = "LOAD_START",
  LOAD_END = "LOAD_END",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  RECIPE_CREATION_INPUT = "RECIPE_CREATION_INPUT",
  CATEGORY_CREATION_INPUT = "CATEGORY_CREATION_INPUT",
  LOGOUT = "LOGOUT",
  DELETE_USER = "DELETE_USER",
  SCHEDULE_TIMER_NOTIFICATION = "SCHEDULE_TIMER_NOTIFICATION",
  CANCEL_TIMER_NOTIFICATION = "CANCEL_TIMER_NOTIFICATION",
  START_LIVE_ACTIVITY = "START_LIVE_ACTIVITY",
  PAUSE_LIVE_ACTIVITY = "PAUSE_LIVE_ACTIVITY",
  RESUME_LIVE_ACTIVITY = "RESUME_LIVE_ACTIVITY",
  END_LIVE_ACTIVITY = "END_LIVE_ACTIVITY",
  LOCK_ORIENTATION = "LOCK_ORIENTATION",
  UNLOCK_ORIENTATION = "UNLOCK_ORIENTATION",
  OPEN_YOUTUBE = "OPEN_YOUTUBE",
  SAFE_AREA = "SAFE_AREA",
  SYSTEM_VOLUME = "SYSTEM_VOLUME",
  TRACK_AMPLITUDE = "TRACK_AMPLITUDE",
}

class InvalidJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidJsonError";
  }
}

// type SafeArea = {
//   left: SafeAreaProps;
//   right: SafeAreaProps;
//   top: SafeAreaProps;
//   bottom: SafeAreaProps;
// };

//webview에서 보낸 메세지를 처리하는 함수
export function useHandleMessage({
  postMessage,
  setSafeArea,
}: {
  postMessage: ({ message }: { message: string }) => void;
  setSafeArea: (safeArea: SafeArea) => void;
}) {
  const { openCreatingView: openCreatingCategoryView } =
    useCreatingCategoryViewStore();
  const { logout } = useLogoutViewModel();
  const { deleteUser } = useDeleteUserViewModel();
  const { removeUser } = useUserStore();
  const reply = <T>(id: string, result: T) => {
    postMessage({ message: JSON.stringify(createReplyResponse(id, result)) });
  };
  const fail = (id: string, error: string) => {
    postMessage({ message: JSON.stringify(createFailResponse(id, error)) });
  };

  const handleMessage = async (event: any) => {
    try {
      const req = (() => {
        try {
          return JSON.parse(event.nativeEvent.data) as
            | RequestMsgBlockingFromWebView
            | RequestMsgUnblockingFromWebView;
        } catch (e) {
          throw new InvalidJsonError("Invalid JSON");
        }
      })();

      switch (req.mode) {
        case WebViewMessageType.BLOCKING: {
          switch (req.type) {
            case payloadType.REFRESH_TOKEN: {
              try {
                const newToken = await refreshToken();
                console.log("[refreshToken] newToken", req.id, newToken);
                reply(req.id, { token: newToken });
              } catch (e: any) {
                removeUser();
                Alert.alert("로그아웃 되었습니다.");
                fail(req.id, e?.message ?? "Unhandled error");
              }
              break;
            }
            case payloadType.CONSUME_INITIAL_DATA: {
              try {
                const messagesConsumed = comsumeReservedMessage();
                reply(req.id, { messagesConsumed: messagesConsumed });
                console.log(
                  "messagesConsumed",
                  JSON.stringify(messagesConsumed),
                );
              } catch (e: any) {
                fail(req.id, e?.message ?? "Unhandled error");
              }
              break;
            }
          }
          break;
        }
        case WebViewMessageType.UNBLOCKING: {
          switch (req.type) {
            case payloadType.CATEGORY_CREATION_INPUT: {
              openCreatingCategoryView(); // creatingCategoryView 컴포넌트를 보여줌.
              break;
            }
            case payloadType.LOGOUT: {
              logout();
              break;
            }
            case payloadType.DELETE_USER: {
              deleteUser();
              break;
            }
            case payloadType.OPEN_YOUTUBE: {
              const youtubeAppUrl = Platform.select({
                ios: "youtube://",
                android: "vnd.youtube://",
              }) as string;

              console.log(youtubeAppUrl);
              try {
                const canOpen = await Linking.canOpenURL(youtubeAppUrl);
                if (canOpen) {
                  await Linking.openURL(youtubeAppUrl);
                } else {
                  await Linking.openURL("https://www.youtube.com");
                }
              } catch (error) {
                await Linking.openURL("https://www.youtube.com");
              }
              break;
            }

            case payloadType.SCHEDULE_TIMER_NOTIFICATION: {
              const { timerId, recipeId, remainingSeconds, recipeTitle } =
                req.payload;
              await scheduleTimerAlarm(
                timerId,
                recipeId,
                recipeTitle,
                remainingSeconds,
              );
              break;
            }
            case payloadType.CANCEL_TIMER_NOTIFICATION: {
              const { timerId } = req.payload;
              await cancelTimerAlarm({ timerId });
              break;
            }
            case payloadType.START_LIVE_ACTIVITY: {
              const { timerId, activityName, endAt, recipeId } = req.payload;
              await startActivity({ timerId, activityName, endAt, recipeId });
              break;
            }
            case payloadType.PAUSE_LIVE_ACTIVITY: {
              const { timerId, startedAt, pausedAt, duration, remainingTime } =
                req.payload;
              await pauseActivity({
                timerId,
                startedAt,
                pausedAt,
                duration,
                remainingTime,
              });
              break;
            }
            case payloadType.RESUME_LIVE_ACTIVITY: {
              const { timerId, startedAt, endAt, duration } = req.payload;
              await resumeActivity({ timerId, startedAt, endAt, duration });
              break;
            }
            case payloadType.END_LIVE_ACTIVITY: {
              const { timerId } = req.payload;
              await endActivity({ timerId });
              break;
            }
            case payloadType.LOCK_ORIENTATION: {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP,
              );
              break;
            }
            case payloadType.UNLOCK_ORIENTATION: {
              await ScreenOrientation.unlockAsync();
              break;
            }
            case payloadType.SAFE_AREA: {
              const { left, right, top, bottom } = req.payload;
              console.log("[SAFE_AREA] left", JSON.stringify(left));
              console.log("[SAFE_AREA] right", JSON.stringify(right));
              console.log("[SAFE_AREA] top", JSON.stringify(top));
              console.log("[SAFE_AREA] bottom", JSON.stringify(bottom));
              setSafeArea({
                left: left
                  ? { isEixsts: left.isExists, color: left.color }
                  : { isEixsts: true, color: "#FFFFFF" },
                right: right
                  ? { isEixsts: right.isExists, color: right.color }
                  : { isEixsts: true, color: "#FFFFFF" },
                top: top
                  ? { isEixsts: top.isExists, color: top.color }
                  : { isEixsts: true, color: "#FFFFFF" },
                bottom: bottom
                  ? { isEixsts: bottom.isExists, color: bottom.color }
                  : { isEixsts: true, color: "#FFFFFF" },
              });
              break;
            }
            case payloadType.TRACK_AMPLITUDE: {
              const { eventName, properties } = req.payload;
              trackFromWebView(eventName, properties);
              break;
            }
          }
          break;
        }
      }
    } catch (e: any) {
      if (e instanceof InvalidJsonError) {
        console.log("[Native] 메세지", event.nativeEvent.data);
        return;
      }
      console.log("[Native] 에러메세지", e.message, event.nativeEvent.data);
    }
  };
  return { handleMessage };
}

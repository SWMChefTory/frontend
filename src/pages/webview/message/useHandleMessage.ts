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
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import { Alert } from "react-native";
import { useLoadStore } from "@/src/pages/webview/load/loadStore";
import { comsumeReservedMessage } from "@/src/shared/webview/sendMessage";
import * as ScreenOrientation from "expo-screen-orientation";

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
}

class InvalidJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidJsonError";
  }
}

//webview에서 보낸 메세지를 처리하는 함수
export function useHandleMessage({
  postMessage,
}: {
  postMessage: ({ message }: { message: string }) => void;
}) {
  const { openCreatingView: openCreatingCategoryView } =
    useCreatingCategoryViewStore();
  const { setIsLoading } = useLoadStore();
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
      console.log("req!!!!", JSON.stringify(req));

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
                  JSON.stringify(messagesConsumed)
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
            case payloadType.LOAD_START: {
              setIsLoading(true);
              break;
            }
            case payloadType.LOAD_END: {
              setIsLoading(false);
              break;
            }
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
            case payloadType.SCHEDULE_TIMER_NOTIFICATION: {
              const { timerId, recipeId, remainingSeconds, recipeTitle } =
                req.payload;
              await scheduleTimerAlarm(
                timerId,
                recipeId,
                recipeTitle,
                remainingSeconds
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
                ScreenOrientation.OrientationLock.PORTRAIT_UP
              );
              break;
            }
            case payloadType.UNLOCK_ORIENTATION: {
              await ScreenOrientation.unlockAsync();
              break;
            }
          }
          break;
        }
      }
    } catch (e: any) {
      if (e instanceof InvalidJsonError) {
        if (event.nativeEvent.data.event === "infoDelivery") {
          return; // 무시
        }
        console.log("[Native] 메세지", event.nativeEvent.data);
        return;
      }
      console.log("[Native] 에러메세지", e.message, event.nativeEvent.data);
    }
  };
  return { handleMessage };
}

import { refreshToken } from "@/src/modules/shared/api/client";
import { Action, WebViewMessageType } from "@/src/shared/webview/messageType";
import { useCreatingRecipeViewStore } from "@/src/widgets/create-recipe-view/store/creatingRecipeViewStore";
import { useCreatingCategoryViewStore } from "@/src/widgets/create-category-view/store/creatingCategoryView";

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
  REFRESH_TOKEN = "REFRESH_TOKEN",
  RECIPE_CREATION_INPUT = "RECIPE_CREATION_INPUT",
  CATEGORY_CREATION_INPUT = "CATEGORY_CREATION_INPUT",
}

//webview에서 보낸 메세지를 처리하는 함수
export function useHandleMessage({
  postMessage,
}: {
  postMessage: ({message}: {message: string}) => void;
}) {
  const { openCreatingView: openCreatingRecipeView } = useCreatingRecipeViewStore();
  const { openCreatingView: openCreatingCategoryView } = useCreatingCategoryViewStore();
  const reply = <T>(id: string, result: T) => {
    postMessage({message: JSON.stringify(createReplyResponse(id, result))});
  };
  const fail = (id: string, error: string) => {
    postMessage({message: JSON.stringify(createFailResponse(id, error))});
  };

  const handleMessage = async (event: any) => {
    try {
      const req = JSON.parse(event.nativeEvent.data) as
        | RequestMsgBlockingFromWebView
        | RequestMsgUnblockingFromWebView;
        console.log("event.nativeEvent.data", JSON.stringify(req));

      switch (req.mode) {
        case WebViewMessageType.BLOCKING: {
          switch (req.type) {
            case payloadType.REFRESH_TOKEN: {
              try {
                const newToken = await refreshToken();
                reply(req.id, { token: newToken });
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
            case payloadType.RECIPE_CREATION_INPUT: {
              openCreatingRecipeView();
              break;
            }
            case payloadType.CATEGORY_CREATION_INPUT: {
              openCreatingCategoryView();
              break;
            }
          }
          break;
        }
      }
    } catch (e: any) {
      // id를 못 읽을 수도 있으니 방어
      try {
        console.log("[Native] 에러메세지", e.message, event.nativeEvent.data);
        const maybe = JSON.parse(event.nativeEvent.data);
        if (maybe?.id) fail(maybe.id, e?.message ?? "Unhandled error");
      } catch {
        /* noop */
      }
    }
  };
  return {handleMessage};
}

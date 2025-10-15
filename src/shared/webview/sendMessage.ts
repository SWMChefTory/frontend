import EventEmitter3 from "eventemitter3";
import { Action, WebViewMessageType } from "@/src/shared/webview/messageType";

const EVENT_TYPE = "WEBVIEW_MESSAGE";

const eventEmitter = new EventEmitter3();

const createMessage = ({ payload }: { payload: any }) => {
  return JSON.stringify({
    intended: true,
    action: Action.REQUEST,
    mode: WebViewMessageType.UNBLOCKING,
    type: payload.type,
    payload: payload.data,
  });
};

export const sendMessage = (payload: { type: string; data: any }) => {
  eventEmitter.emit(EVENT_TYPE, JSON.stringify(payload));
};

//payload는 무조건 객체여야 함. 문자열 아님!!
//payload를 postMessage를 통해 웹뷰로 보냄!
export const subscribeMessage = (postMessage: (payload: string) => void) => {
  eventEmitter.on(EVENT_TYPE, (payload) => {
    const payloadParsed = JSON.parse(payload);
    postMessage(createMessage({ payload: payloadParsed }));
  });
};

export const createPayload = ({ type, data }: { type: string; data: any }) => {
  return {
    type,
    payload: data,
  };
};

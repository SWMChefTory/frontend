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

const reserveMessageQueue: { type: string; data: any }[] = [];

//sendMessage는 즉시 웹뷰로 메세지를 보내고, reserveMessage는 웹뷰가 로드될 때까지 대기하다 보냄.
export const reserveMessage = (payload: { type: string; data: any }) => {
  console.log("reserveMessage", payload);
  reserveMessageQueue.push(payload);
  console.log("reserveMessageQueue", JSON.stringify(reserveMessageQueue));
};

export const comsumeReservedMessage = () => {
  const messagesConsumed = [...reserveMessageQueue];
  reserveMessageQueue.length = 0;
  console.log("messagesConsumed", JSON.stringify(messagesConsumed));
  return messagesConsumed;
};

//payload는 무조건 객체여야 함. 문자열 아님!!
//payload를 postMessage를 통해 웹뷰로 보냄!
export const subscribeMessage = (postMessage: (payload: string) => void) => {
  eventEmitter.on(EVENT_TYPE, (payload) => {
    const payloadParsed = JSON.parse(payload);
    postMessage(createMessage({ payload: payloadParsed }));
  });
};

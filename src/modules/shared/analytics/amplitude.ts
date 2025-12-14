import { init, add } from "@amplitude/analytics-react-native";
import { SessionReplayPlugin } from "@amplitude/plugin-session-replay-react-native";
import * as Crypto from "expo-crypto";
import {
  findAmplitudeUserId,
  storeAmplitudeUserId,
} from "../storage/SecureStorage";

const AMPLITUDE_API_KEY = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY!;

// UUID 조회 또는 생성 (있으면 재사용, 없으면 생성)
const getOrCreateUserId = async (): Promise<string> => {
  const existingUserId = findAmplitudeUserId();

  if (existingUserId) {
    return existingUserId;
  }

  const newUserId = Crypto.randomUUID();
  await storeAmplitudeUserId(newUserId);
  return newUserId;
};

// Amplitude 초기화
export const initAmplitude = async () => {
  try {
    console.log("[Amplitude] API Key:", AMPLITUDE_API_KEY);
    const userId = await getOrCreateUserId();
    console.log("[Amplitude] User ID:", userId);

    await init(AMPLITUDE_API_KEY, userId).promise;
    console.log("[Amplitude] init 완료");

    await add(new SessionReplayPlugin({ sampleRate: 1 })).promise;
    console.log("[Amplitude] SessionReplay 추가 완료");
  } catch (error) {
    console.error("[Amplitude] 초기화 에러:", error);
  }
};

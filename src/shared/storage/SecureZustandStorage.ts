import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

//항상 SecureZustandStorageName 에 있는 이름만 사용해야 함.
export const secureZustandStorage: StateStorage = {
  getItem: async (name: string) => {
    validateName(name);
    const v = await SecureStore.getItemAsync(name);
    return v ?? null;
  },
  setItem: async (name: string, value: string) => {
    validateName(name);
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    validateName(name);
    await SecureStore.deleteItemAsync(name);
  },
};

function validateName(name: string) {
  if (name !== SecureZustandStorageName.TIMER_STORE && name !== SecureZustandStorageName.LIVE_ACTIVITY_STORE) {
    throw new Error("Invalid name");
  }
}

export enum SecureZustandStorageName {
  TIMER_STORE = "cheftory.timer.store",
  LIVE_ACTIVITY_STORE = "cheftory.liveactivity.store",
}


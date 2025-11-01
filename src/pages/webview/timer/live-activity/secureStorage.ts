import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

export const secureZustandStorage: StateStorage = {
  getItem: async (name: string) => {
    const v = await SecureStore.getItemAsync(name);
    return v ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

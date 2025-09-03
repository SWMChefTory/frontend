// src/stores/interactionBlocker.ts
import { create } from "zustand";

type State = { blocked: boolean; message?: string };
type Actions = { block: (msg?: string) => void; unblock: () => void };

export const useInteractionBlocker = create<State & Actions>((set) => ({
  blocked: false,
  message: undefined,
  block: (message) => set({ blocked: true, message }),
  unblock: () => set({ blocked: false, message: undefined }),
}));

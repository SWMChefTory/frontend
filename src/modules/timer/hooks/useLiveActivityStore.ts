// stores/useLiveActivityStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureZustandStorage } from "@/src/modules/timer/store/secureZustand";

type LiveActivityStore = {
  liveActivityId: string | null;
  setLiveActivityId: (id: string | null) => void;
};

export const useLiveActivityStore = create<LiveActivityStore>()(
  persist(
    (set) => ({
      liveActivityId: null,
      setLiveActivityId: (id) => set({ liveActivityId: id }),
    }),
    {
      name: "cheftory.liveactivity.id",
      storage: createJSONStorage(() => secureZustandStorage),
    },
  ),
);

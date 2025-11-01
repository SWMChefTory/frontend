import { create } from "zustand";

interface CreatingCategoryViewStore {
  isCreatingOpened: boolean;
  openCreatingView: () => void;
  closeCreatingView: () => void;
}

export const useCreatingCategoryViewStore = create<CreatingCategoryViewStore>(
  (set) => ({
    isCreatingOpened: false,
    openCreatingView: () => set({ isCreatingOpened: true }),
    closeCreatingView: () => set({ isCreatingOpened: false }),
  }),
);

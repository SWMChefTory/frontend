import { create } from "zustand";

interface CreatingRecipeViewStore {
  isCreatingOpened: boolean;
  openCreatingView: () => void;
  closeCreatingView: () => void;
}

export const useCreatingRecipeViewStore = create<CreatingRecipeViewStore>((set) => ({
  isCreatingOpened: false,
  openCreatingView: () => set({ isCreatingOpened: true }),
  closeCreatingView: () => set({ isCreatingOpened: false }),
}));
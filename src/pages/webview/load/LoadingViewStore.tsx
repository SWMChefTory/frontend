// const useIsLoadingViewOpenimport { create } from "zustand";
import {create} from "zustand";

interface IsLoadingViewOpenState {
    isLoadingViewOpen: boolean;
    closeLoadingView: () => void;
  }
  
  export const useIsLoadingViewOpen = create<IsLoadingViewOpenState>((set) => ({
    isLoadingViewOpen: true,
  
    closeLoadingView: () =>
      set({ isLoadingViewOpen: false }),
  }));
  
import { create } from 'zustand';

type WebViewStore = {
  isWebviewLoaded: boolean;
  setIsWebviewLoaded: (loaded: boolean) => void;
};

export const useWebViewStore = create<WebViewStore>((set) => ({
  isWebviewLoaded: false,
  setIsWebviewLoaded: (loaded) => set({ isWebviewLoaded: loaded }),
}));

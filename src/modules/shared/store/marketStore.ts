import { create } from "zustand";
import type { Market } from "../types/market";

type MarketStore = {
  market: Market | null;
  countryCode: string | null;
  cachedMarket: Market | null;
  isLoading: boolean;
  error: Error | null;

  setMarket: (market: Market, countryCode: string) => void;
  setCachedMarket: (market: Market) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
};

export const useMarketStore = create<MarketStore>((set) => ({
  market: null,
  countryCode: null,
  cachedMarket: null,
  isLoading: true,
  error: null,

  setMarket: (market, countryCode) =>
    set({ market, countryCode, isLoading: false, error: null }),

  setCachedMarket: (market) => {
    console.debug("[Market Store] setCachedMarket:", market);
    set({ cachedMarket: market });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () =>
    set({
      market: null,
      countryCode: null,
      // cachedMarket은 리셋하지 않음 (AsyncStorage 일관성 유지)
      isLoading: true,
      error: null,
    }),
}));

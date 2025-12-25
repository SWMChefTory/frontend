import { create } from "zustand";
import type { Market } from "../types/market";

type MarketStore = {
  market: Market | null;
  countryCode: string | null;
  isLoading: boolean;
  error: Error | null;

  setMarket: (market: Market, countryCode: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
};

export const useMarketStore = create<MarketStore>((set) => ({
  market: null,
  countryCode: null,
  isLoading: true,
  error: null,

  setMarket: (market, countryCode) =>
    set({ market, countryCode, isLoading: false, error: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set({
    market: null,
    countryCode: null,
    isLoading: true,
    error: null,
  }),
}));

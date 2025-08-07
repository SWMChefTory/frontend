import { create } from 'zustand';

interface LogoStore {
  logo: React.ReactNode | null;
  setLogo: (logo: React.ReactNode) => void;
}

export const useLogoStore = create<LogoStore>((set) => ({
  logo: null,
  setLogo: (logo) => set({ logo }),
}));
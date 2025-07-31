import { create } from 'zustand'

type UserStore = {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => {
    set({ user, isLoggedIn : !!user });
  },
}));
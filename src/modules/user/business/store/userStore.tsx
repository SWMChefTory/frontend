import { create } from "zustand";
import { User } from "@/src/modules/user/business/viewmodel/user";

type UserStore = {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  removeUser: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => {
    if (!(user instanceof User)) {
      throw new Error("User is not a User Instance");
    }
    set({ user, isLoggedIn: true });
  },
  removeUser: () => {
    set({ user: null, isLoggedIn: false });
  },
}));

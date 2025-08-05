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

//todo : (우선 순위 높음) 또다른 UseStore를 통해서 필요한 정보만 반환하도록 구현.
//todo : (우선 순위 낮음) 리터럴 방식으로도 구현.

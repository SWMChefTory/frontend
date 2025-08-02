import { create } from 'zustand'
import { UTCDateAtMidnight } from '../utils/UTCDateAtMidnight';

type UserStore = {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
    setNickname: (name: string) => void;
    setDateOfBirth: (dateOfBirth: UTCDateAtMidnight) => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => {
    set({ user, isLoggedIn : !!user });
  },
  setNickname: (name: string) => {
    const currentUser = get().user;
    if (currentUser) {  // null 체크
      set({ user: { ...currentUser, nickname: name } }); // name 사용
    }
  },
  setDateOfBirth: (dateOfBirth: UTCDateAtMidnight) => {
    const currentUser = get().user;
    if (currentUser) {  // null 체크
      set({ user: { ...currentUser, dateOfBirth: dateOfBirth } }); // name 사용
    }
  },
}));
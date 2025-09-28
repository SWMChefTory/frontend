import { create } from "zustand";
import { User } from "@/src/modules/user/business/viewmodel/user";

export type DeepLinkAction = {
  actionType: string;
  params: Record<string, string>;
};

type DeepLinkActionStore = {
  deepLinkAction: DeepLinkAction | null;
  setDeepLinkAction: (deepLinkAction: DeepLinkAction) => void;
  clearDeepLinkAction: () => void;
};

export const deepLinkActionStore = create<DeepLinkActionStore>((set, get) => ({
  deepLinkAction: null,
  setDeepLinkAction: (deepLinkAction) => {
    set({ deepLinkAction });
  },
  clearDeepLinkAction: () => {
    set({ deepLinkAction: null });
  },
}));

//todo : (우선 순위 높음) 또다른 UseStore를 통해서 필요한 정보만 반환하도록 구현.
//todo : (우선 순위 낮음) 리터럴 방식으로도 구현.

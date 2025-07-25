import { Gender } from "../../login/enums/Gender";

export interface LoginInfo {
  id_token: string;
  provider: string;
}

export interface SignupData {
  provider: string;
  id_token: string;
  nickname: string;
  gender: Gender;
}

export interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
}

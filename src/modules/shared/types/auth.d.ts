import { Gender } from "../../user/enums/Gender";

export interface LoginInfo {
  id_token: string;
  provider: OauthProvider;
}

export interface SignupData {
  provider: string;
  id_token: string;
  nickname: string;
  gender: Gender | null;
  date_of_birth: DateOnly | null;
  is_marketing_agreed: boolean;
  is_privacy_agreed: boolean;
  is_terms_of_use_agreed: boolean;
}

export interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
}

import { Gender } from "../modules/login/enums/Gender";

export interface LoginInfo{
    provider_token: string;
    provider: string;
}

export interface SignupData {
  provider: string;
  token: string;
  nickname: string;
  gender: Gender;
}

export interface AuthContextType {
    user: any;
    accessToken: string | null;
    isLoggedIn: boolean;
    signin: (loginInfo: LoginInfo) => Promise<void>;
    signup: (signupData: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    deleteUser: () => Promise<void>;
    loading: boolean;
}
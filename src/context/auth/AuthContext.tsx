import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { findAccessToken, removeAuthToken, storeAuthToken, findRefreshToken } from "./storage/SecureStorage";
import { AxiosError } from "axios";
import { extractAxiosErrorInfo } from "@/src/utils/axiosUtils";
import { StatusCodes} from 'http-status-codes';
import { AuthContextType, LoginInfo, SignupData } from "@/src/types/auth";
import proxyServerClient from "@/src/app/client/proxyserverClient";
import { Alert } from "react-native";

const LOGIN_PATH = "/v1/account/login/oauth";
const SIGNUP_PATH = "/v1/account/signup/oauth";
const LOGOUT_PATH = "/v1/account/logout";
const DELETE_USER_PATH = "/api/users/me";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const getUser :() => Promise<User> = async ()=>{
  const accessToken = await findAccessToken();
  if(!accessToken){
    return null;
  }
  const response = await proxyServerClient.post("/api/user/me", {accessToken});
  return response.data;
}

export const AuthProvider = ({ children } : AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 앱 시작 시 초기 로딩

  // 앱 시작 시 저장된 토큰 복원
  useEffect(() => {
    const bootstrap = async () => {
      const token = await findAccessToken();
      if (!token) {
        toUnAuthorized();
      }
      setAccessToken(token);
      setUser(await getUser());
      setLoading(false);
    };
    bootstrap();
  }, []);

  const toUnAuthorized = async () => {
    removeAuthToken();
    setUser(null);
    setAccessToken(null);
  };

  const logout = async () => {
    await proxyServerClient
    .post(LOGOUT_PATH,{"refreshToken" : findRefreshToken()})
    .catch(err=>{
      if(err instanceof AxiosError){
        const errorInfo = extractAxiosErrorInfo(err);
        Alert.alert("로그아웃 실패");
        console.log(errorInfo.message);
        throw new Error(errorInfo.message);
      }
    });
    await toUnAuthorized();
  };

  const signin = async ({provider_token, provider}: LoginInfo) => {
    return await proxyServerClient.post(LOGIN_PATH, {
        "provider" : provider,
        "token" : provider_token,
      })
      .then(async res =>{
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        storeAuthToken(res.data.accessToken, res.data.refreshToken);
      })
      .catch(err=>{
        if(err instanceof AxiosError){
          const errorInfo = extractAxiosErrorInfo(err);
          if(errorInfo.code === StatusCodes.UNAUTHORIZED && errorInfo.error === "USER_NOT_FOUND"){
            throw new Error(errorInfo.error);
          }
        } 
        throw new Error("알 수 없는 에러" + err);
      });
  };

  const signup = async (signupData: SignupData) => {
      try {
        const response = await proxyServerClient
        .post(SIGNUP_PATH, signupData);
        
        setUser(response.data.user);
        setAccessToken(response.data.accessToken);
        storeAuthToken(response.data.accessToken, response.data.refreshToken);
      } catch (err) {
        if(err instanceof AxiosError){
          await toUnAuthorized();
        }
      }
  };

  const deleteUser = async () => {
    await proxyServerClient.delete(DELETE_USER_PATH, {
      headers: {
        'refresh_token': await findRefreshToken()
      }
    });
    await toUnAuthorized();
  };
    
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn: !!user,
        signin: signin,
        signup,
        logout,
        deleteUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
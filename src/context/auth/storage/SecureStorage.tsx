import * as SecureStore from "expo-secure-store";
import proxyServerClient from "@/src/app/client/proxyserverClient";


const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const findAccessToken: () => Promise<string | null> = async ()=>{
    let accessToken = SecureStore.getItem("access_token");
    if(accessToken){
        try {
          await proxyServerClient.post("/api/auth/token/check", { access_token : accessToken });
          return accessToken;
        } catch (err) {
          return null;
        }
    }
    const refreshToken = SecureStore.getItem(REFRESH_TOKEN_KEY);
    if(!refreshToken){
        return null;
    }
    return accessToken = await proxyServerClient.post("/api/auth/token/refresh", { refresh_token : refreshToken })
    .then(res => res.data.accessToken)
    .catch(err => {
        console.log(err);
        return null;
    });
}

export const findRefreshToken: () => string | null = ()=>{
    return SecureStore.getItem(REFRESH_TOKEN_KEY);
}

export const storeAccessToken = async (accessToken: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
}

export const storeRefreshToken = async (accessToken: string) => {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, accessToken);
}

export const storeAuthToken = async (accessToken: string, refreshToken: string) => {
    await storeAccessToken(accessToken);
    await storeRefreshToken(refreshToken);
}


export const removeAuthToken = async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const findRefreshToken: () => string | null = () => {
  return SecureStore.getItem(REFRESH_TOKEN_KEY);
};

export const findAccessToken: () => string | null = () => {
  return SecureStore.getItem(ACCESS_TOKEN_KEY);
};
export const storeAccessToken = async (accessToken: string) => {
  console.debug("Storing access token", accessToken);
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
};

export const storeRefreshToken = async (refreshToken: string) => {
  console.debug("Storing refresh token", refreshToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const storeAuthToken = async (
  accessToken: string,
  refreshToken: string,
) => {
  await storeAccessToken(accessToken);
  await storeRefreshToken(refreshToken);
  console.log("access_token", findAccessToken());
  console.log("refresh_token", findRefreshToken());
};

export const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

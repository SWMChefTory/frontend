import { useMutation } from "@tanstack/react-query";
import {
  deleteAccount,
  loginUser,
  logoutUser,
  signupUser,
} from "@/src/modules/shared/api/apiWithoutAuth";
import { useUserStore } from "@/src/modules/shared/store/userStore";
import {
  findRefreshToken,
  removeAuthToken,
  storeAuthToken,
} from "../../../shared/storage/SecureStorage";
import { LoginInfo, SignupData } from "../../../shared/types/auth";
import { AxiosError } from "axios";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function useLoginViewModel() {
  const { setUser } = useUserStore();
  const router = useRouter();

  const { mutate: login, isPending: isLoading, error } = useMutation({
    mutationFn: async (loginInfo: LoginInfo) => {
      return loginUser(loginInfo)},
    onSuccess: (data) => {
      setUser(data.user_info);
      storeAuthToken(data.access_token, data.refresh_token);
    },
    onError: (error,variables) => {
      if (error instanceof AxiosError){
        console.log(error.response?.data);
      }

      if (error instanceof AxiosError && error.response?.data?.errorCode === "USER_001") {
        router.push({
          pathname: "/auth/signup",
          params: {
            token: variables.id_token,
            provider: variables.provider,
          },
        });
        return;
      }
      Alert.alert("알 수 없는 이유로 로그인에 실패했습니다.");
    },
    throwOnError: false,
  });

  return { login, isLoading, error };
}

export function useSignupViewModel() {
  const { setUser } = useUserStore();
  const { mutate: signup, isPending: isLoading, error } = useMutation({
    mutationFn: (signupData: SignupData) => {
      return signupUser(signupData)},
    onSuccess: (data) => {
      setUser(data.user_info);
      storeAuthToken(data.access_token, data.refresh_token);
    },
    onError: (error) => {
      console.log("signup error", error);
    },
    throwOnError: false,
  });

  return { signup, isLoading, error };
}

export function useLogoutViewModel() {
  const { setUser } = useUserStore();
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const refreshToken = findRefreshToken();
      if (refreshToken) {
        logoutUser(refreshToken);
      }
    },
    onSuccess: () => {
      setUser(null);
      removeAuthToken();
    },
  });

  return { logout, isLoading };
}

export function useDeleteUserViewModel() {
  const { setUser } = useUserStore();

  const { mutate: deleteUser, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const refreshToken = findRefreshToken();
      if (refreshToken) {
        return deleteAccount(refreshToken);
      }
    },
    onSuccess: () => {
      setUser(null);
      removeAuthToken();
    },
  });

  return { deleteUser, isLoading };
}

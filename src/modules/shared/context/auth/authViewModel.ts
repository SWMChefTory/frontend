import { useMutation } from "@tanstack/react-query";
import {
  deleteAccount,
  loginUser,
  logoutUser,
  signupUser,
} from "./api";
import { useAuth } from "./AuthContext";
import {
  findRefreshToken,
  removeAuthToken,
  storeAuthToken,
} from "./storage/SecureStorage";
import { LoginInfo, SignupData } from "../../types/auth";
import { AxiosError } from "axios";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export function useLoginViewModel() {
  const { setUser } = useAuth();
  const router = useRouter();

  const { mutate: login, isPending: isLoading, error } = useMutation({
    mutationFn: (loginInfo: LoginInfo) => loginUser(loginInfo),
    onSuccess: (data) => {
      setUser(data.user_info);
      storeAuthToken(data.access_token, data.refresh_token);
    },
    onError: (error,variables) => {
      if (error instanceof AxiosError && error.response?.data?.errorCode === "USER_1") {
        router.push({
          pathname: "/auth/signup",
          params: {
            token: variables.id_token,
            provider: variables.provider,
          },
        });
      }
      Alert.alert("알 수 없는 이유로 로그인에 실패했습니다.");
    },
    throwOnError: false,
  });

  return { login, isLoading, error };
}

export function useSignupViewModel() {
  const { setUser } = useAuth();

  const { mutate: signup, isPending: isLoading, error } = useMutation({
    mutationFn: (signupData: SignupData) => signupUser(signupData),
    onSuccess: (data) => {
      setUser(data.user_info);
      storeAuthToken(data.access_token, data.refresh_token);
    },
  });

  return { signup, isLoading, error };
}

export function useLogoutViewModel() {
  const { setUser } = useAuth();
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const refreshToken = await findRefreshToken();
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
  const { setUser } = useAuth();

  const { mutate: deleteUser, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const refreshToken = await findRefreshToken();
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

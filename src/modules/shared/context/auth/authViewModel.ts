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

export function useLoginViewModel() {
  const { setUser } = useAuth();

  const { mutate: login, isPending: isLoading, error } = useMutation({
    mutationFn: (loginInfo: LoginInfo) => loginUser(loginInfo),
    onSuccess: (data) => {
      setUser(data.user_info);
      storeAuthToken(data.access_token, data.refresh_token);
    },
    throwOnError: false,
  });

  return { login, isLoading, error };
}

export function useSignupViewModel() {
  const { setUser } = useAuth();

  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: (signupData: SignupData) => signupUser(signupData),
    onSuccess: (data) => {
      setUser(data.user_info);
      storeAuthToken(data.access_token, data.refresh_token);
    },
  });

  return { signup, isLoading };
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

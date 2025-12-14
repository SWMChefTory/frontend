import { useMutation } from "@tanstack/react-query";
import {
  deleteAccount,
  loginUser,
  logoutUser,
  signupUser,
} from "@/src/modules/shared/api/apiWithoutAuth";
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import {
  findAccessToken,
  findRefreshToken,
  removeAuthToken,
  storeAuthToken,
} from "@/src/modules/shared/storage/SecureStorage";
import { LoginInfo, SignupData } from "@/src/modules/shared/types/auth";
import { User } from "@/src/modules/user/business/viewmodel/user";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { useSignupModalStore } from "@/src/pages/login/ui/button";
import { trackNative } from "@/src/modules/shared/analytics";
import { AmplitudeEvent } from "@/src/modules/shared/analytics/amplitudeEvents";

export function useLoginViewModel() {
  const { setUser } = useUserStore();
  const {
    mutate: login,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (loginInfo: LoginInfo) => {
      const data = await loginUser(loginInfo);
      const user = User.create({
        gender: data.user_info.gender,
        nickname: data.user_info.nickname,
        dateOfBirth: data.user_info.date_of_birth
          ? DateOnly.create(data.user_info.date_of_birth)
          : null,
        isMarketingAgreed: data.user_info.is_marketing_agreed,
        isPrivacyAgreed: data.user_info.is_privacy_agreed,
        isTermsOfUseAgreed: data.user_info.is_terms_of_use_agreed,
      });
      return {
        user,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      };
    },
    onSuccess: (data, variables) => {
      console.log("login success", data);
      console.log("user", JSON.stringify(data.user));
      setUser(data.user);
      storeAuthToken(data.access_token, data.refresh_token);
      trackNative(AmplitudeEvent.LOGIN_SUCCESS, {
        provider: variables.provider.toLowerCase(),
        is_new_user: false,
      });
    },
    throwOnError: false,
  });

  return { login, isLoading, error };
}

export function useSignupViewModel() {
  const { setUser } = useUserStore();
  const { closeModal } = useSignupModalStore();
  const {
    mutate: signup,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (signupData: SignupData) => {
      return signupUser(signupData);
    },
    onSuccess: async (data, variables) => {
      await storeAuthToken(data.access_token, data.refresh_token);
      setUser(
        User.create({
          gender: data.user_info.gender,
          nickname: data.user_info.nickname,
          dateOfBirth: data.user_info.date_of_birth
            ? DateOnly.create(data.user_info.date_of_birth)
            : null,
          isMarketingAgreed: data.user_info.is_marketing_agreed,
          isPrivacyAgreed: data.user_info.is_privacy_agreed,
          isTermsOfUseAgreed: data.user_info.is_terms_of_use_agreed,
        }),
      );
      trackNative(AmplitudeEvent.LOGIN_SUCCESS, {
        provider: variables.provider.toLowerCase(),
        is_new_user: true,
      });
    },
    onError: (error) => {
      console.log("signup error", error);
      closeModal();
    },
    throwOnError: true,
  });

  return { signup, isLoading, error };
}

export function useLogoutViewModel() {
  const { removeUser } = useUserStore();
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const refreshToken = findRefreshToken();
      if (refreshToken) {
        logoutUser(refreshToken);
      }
    },
    onSuccess: () => {
      trackNative(AmplitudeEvent.LOGOUT);
      removeAuthToken();
      removeUser();
    },
    onError: (error) => {
      trackNative(AmplitudeEvent.LOGOUT);
      removeAuthToken();
      removeUser();
    },
  });

  return { logout, isLoading };
}

export function useDeleteUserViewModel() {
  const { removeUser } = useUserStore();

  const {
    mutate: deleteUser,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async () => {
      const refreshToken = findRefreshToken();
      if (refreshToken) {
        return deleteAccount(refreshToken);
      }
    },
    onSuccess: () => {
      removeUser();
      removeAuthToken();
    },
  });

  return { deleteUser, isLoading, error };
}

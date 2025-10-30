import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
} from "@/src/modules/shared/api/apiWithoutAuth";
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import {
  storeAuthToken,
} from "@/src/modules/shared/storage/SecureStorage";
import { LoginInfo } from "@/src/modules/shared/types/auth";
import { User } from "@/src/modules/user/business/viewmodel/user";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";

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
        dateOfBirth: data.user_info.date_of_birth ? DateOnly.create(data.user_info.date_of_birth) : null,
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
    onSuccess: (data) => {
      setUser(
        data.user
      );
      storeAuthToken(data.access_token, data.refresh_token);
    },
    throwOnError: true,
  });

  return { login, isLoading, error };
}
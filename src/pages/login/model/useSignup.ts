import { signupUser } from "@/src/modules/shared/api/apiWithoutAuth";
import { storeAuthToken } from "@/src/modules/shared/storage/SecureStorage";
import { SignupData } from "@/src/modules/shared/types/auth";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import { User } from "@/src/modules/user/business/viewmodel/user";
import { useMutation } from "@tanstack/react-query";

export function useSignupViewModel() {
  const { setUser } = useUserStore();
  const {
    mutate: signup,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (signupData: SignupData) => {
      return signupUser(signupData);
    },
    onSuccess: async (data) => {
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
        })
      );
    },
    onError: (error) => {
      console.log("signup error", error);
    },
    throwOnError: true,
  });

  return { signup, isLoading, error };
}

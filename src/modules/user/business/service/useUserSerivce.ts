import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getUser,
  patchUser,
} from "@/src/modules/user/business/service/api/api";
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import { User } from "../viewmodel/user";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { useEffect } from "react";
import { Gender } from "../../enums/Gender";
import * as Sentry from '@sentry/react-native';

export function useUserViewModel() {
  const { user, setUser } = useUserStore();
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return getUser();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setUser(
        User.create({
          gender: data.gender,
          nickname: data.nickname,
          dateOfBirth: data.date_of_birth,
          isMarketingAgreed: data.is_marketing_agreed,
          isPrivacyAgreed: data.is_privacy_agreed,
          isTermsOfUseAgreed: data.is_terms_of_use_agreed,
        }),
      );
    }
  }, [data, setUser]);

  return user;
}

export function useChangeUserViewModel() {
  const { setUser } = useUserStore();

  const { mutateAsync: changeUser, isPending: isLoading } = useMutation({
    onMutate: async (user: User) => {
      if (!user) {
        throw new Error("User is null");
      }
      console.log("user", user);
      const userChanged = User.create(user);
      return { userChanged };
    },
    mutationFn: async (user: User) => {
      return await patchUser({
        gender: user.gender,
        nickname: user.nickname,
        date_of_birth: user.dateOfBirth,
        is_marketing_agreed: user.isMarketingAgreed,
        is_privacy_agreed: user.isPrivacyAgreed,
        is_terms_of_use_agreed: user.isTermsOfUseAgreed,
      });
    },
    onSuccess: (data, variables, context) => {
      console.log("user", context?.userChanged);
      setUser(context?.userChanged||null);
    },
    onError: (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    },
    throwOnError: false,
  });

  return { changeUser, isLoading };
}


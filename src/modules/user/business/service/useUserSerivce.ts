import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getUser,
  changeUserNickname,
  changeUserDateOfBirth,
  changeUserGender,
} from "@/src/modules/user/business/service/api/api";
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import { User } from "../viewmodel/user";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { useEffect } from "react";
import { Gender } from "../../enums/Gender";

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
          dateOfBirth: data.date_of_birth ? DateOnly.create(data.date_of_birth) : null,
          isMarketingAgreed: data.is_marketing_agreed,
          isPrivacyAgreed: data.is_privacy_agreed,
          isTermsOfUseAgreed: data.is_terms_of_use_agreed,
        }),
      );
    }
  }, [data, setUser]);

  return user;
}

export function useChangeNameViewModel() {
  const { setUser, user } = useUserStore();
  const { mutate: changeNickname, isPending: isLoading } = useMutation({
    onMutate: async (name: string) => {
      //유저 유효성 검증은 도메인 모델에서 진행
      if (!user) {
        throw new Error("User is null");
      }
      const userChanged = user.withNickname(name);
      return { userChanged };
    },
    //유효성 검증이 완료되면 전송
    mutationFn: async (name: string) => {
      return changeUserNickname(name);
    },
    //서버까지 통신 잘되면 상태 변화.
    onSuccess: (data, variables, context) => {
      setUser(context?.userChanged);
    },
    onError: (error) => {
      console.error(error);
    },
    throwOnError: false,
  });
  return { changeNickname, isLoading };
}

export function useChangeDateOfBirthViewModel() {
  const { setUser, user } = useUserStore();
  const { mutate: changeDateOfBirth, isPending: isLoading } = useMutation({
    onMutate: async (dateOfBirth: DateOnly) => {
      if (!user) {
        throw new Error("User is null");
      }
      const userChanged = user.withDateOfBirth(dateOfBirth);
      return { userChanged };
    },
    mutationFn: async (dateOfBirth: DateOnly) => {
      return changeUserDateOfBirth(dateOfBirth.toJSON());
    },
    onSuccess: (data, variables, context) => {
      setUser(context?.userChanged);
    },
    onError: (error) => {
      console.error(error);
    },
    throwOnError: false,
  });
  return { changeDateOfBirth, isLoading };
}

export function useChangeGenderViewModel() {
  const { setUser, user } = useUserStore();
  const { mutate: changeGender, isPending: isLoading } = useMutation({
    onMutate: async (gender: Gender) => {
      if (!user) {
        throw new Error("User is null");
      }
      const userChanged = user.withGender(gender);
      return { userChanged };
    },
    mutationFn: async (gender: Gender) => {
      return changeUserGender(gender);
    },
    onSuccess: (data, variables, context) => {
      setUser(context?.userChanged);
    },
    onError: (error) => {
      console.error(error);
    },
    throwOnError: false,
  });
  return { changeGender, isLoading };
}

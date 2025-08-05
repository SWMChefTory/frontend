import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getUser,
  changeUserNickname,
  changeUserDateOfBirth,
} from "@/src/modules/user/api/api";
import { useUserStore } from "@/src/modules/shared/store/userStore";
import { useEffect } from "react";
import { UTCDateAtMidnight } from "@/src/modules/shared/utils/UTCDateAtMidnight";

export function useUserViewModel() {
  const { user, setUser } = useUserStore();
  const { data } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: () => {
      return getUser();
    },
    retry: false,
  });
  useEffect(() => {
    if (data) {
      setUser(data);
      return;
    }
    setUser(null);
  }, [data]);
  return user;
}

export function useChangeNameViewModel() {
  const { setNickname } = useUserStore();
  const { mutate: changeNickname, isPending: isLoading } = useMutation({
    mutationFn: async (name: string) => {
      if (!name || name.trim() === "") {
        throw new Error("닉네임을 입력해주세요.");
      }
      return changeUserNickname(name);
    },
    onSuccess: (data, variables) => {
      setNickname(variables);
    },
    onError: (error) => {
      console.error(error);
    },
    throwOnError: false,
  });
  return { changeNickname, isLoading };
}

export function useChangeDateOfBirthViewModel() {
  const { setDateOfBirth } = useUserStore();
  const { mutate: changeDateOfBirth, isPending: isLoading } = useMutation({
    mutationFn: async (dateOfBirth: UTCDateAtMidnight) => {
      if (!dateOfBirth) {
        throw new Error("생년월일을 입력해주세요.");
      }
      return changeUserDateOfBirth(dateOfBirth);
    },
    onSuccess: (data, variables) => {
      setDateOfBirth(variables);
    },
    onError: (error) => {
      console.error(error);
    },
    throwOnError: false,
  });
  return { changeDateOfBirth, isLoading };
}

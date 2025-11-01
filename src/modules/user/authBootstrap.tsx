import { getUser } from "@/src/modules/user/business/service/api/api";
import { useUserStore } from "@/src/modules/user/business/store/userStore";
import { useEffect, useState } from "react";
import { User } from "@/src/modules/user/business/viewmodel/user";

export function useAuthBootstrap() {
  const { removeUser, setUser, isLoggedIn } = useUserStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await getUser(); // 토큰이 있다면 서버에서 사용자 복원
        setUser(
          User.create({
            gender: user.gender,
            nickname: user.nickname,
            dateOfBirth: user.date_of_birth,
            isMarketingAgreed: user.is_marketing_agreed,
            isPrivacyAgreed: user.is_privacy_agreed,
            isTermsOfUseAgreed: user.is_terms_of_use_agreed,
          }),
        );
      } catch (e) {
        removeUser();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return { loading, isLoggedIn };
}

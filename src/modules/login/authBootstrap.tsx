import { getUser } from '@/src/modules/login/api/api';
import { useUserStore } from '@/src/modules/shared/store/userStore';
import { useEffect,useState } from 'react';


export function useAuthBootstrap(){
  const { setUser, isLoggedIn } = useUserStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUser(); // 토큰이 있다면 서버에서 사용자 복원
        setUser(user);
      } catch (e) {
        setUser(null); // 실패 시 초기화
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  
  return { loading, isLoggedIn };
}
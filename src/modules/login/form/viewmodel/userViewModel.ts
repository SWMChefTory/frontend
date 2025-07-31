import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/src/modules/login/api/api';
import { useUserStore } from '@/src/modules/shared/store/userStore';
import { useEffect } from 'react';

export function useUserViewModel() {
  const {user, setUser} = useUserStore();
  const {data} = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: ()=>{
      return getUser();
    },
    retry: false, 
  });
  useEffect(()=>{
    if(data){
      setUser(data);
      return;
    }
    setUser(null);
  },[data])
  return user;
}
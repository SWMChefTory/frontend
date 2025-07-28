import { getUser } from "@/src/modules/shared/context/auth/api";
import { AuthContextType } from "@/src/modules/shared/types/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 저장된 토큰으로 사용자 정보 복원
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  return (
    console.log(!!user),
    (
      <AuthContext.Provider
        value={{
          user,
          isLoggedIn: !!user,
          loading,
          setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

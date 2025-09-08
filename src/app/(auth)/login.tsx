import LoginPage from "@/src/modules/user/presentation/login/LoginPage";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function LoginScreen() {
  useEffect(() => {
    track.screen("Login");
  }, []);
  return (
    <LoginPage isReal={true} />
  );
}
import { LoginPage } from "@/src/pages/login/index";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function LoginScreen() {
  useEffect(() => {
    track.screen("Login");
  }, []);

  console.log("LoginScreen!!!!");
  return <LoginPage />;
}

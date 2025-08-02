import React, { useEffect, useState } from "react";
import { useAuthBootstrap } from "@/src/modules/user/authBootstrap";
import * as ExpoSplashScreen from "expo-splash-screen";
import { SplashScreen } from "../splash/SplashScreen";

export function SplashScreenController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuthBootstrap();
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepareApp() {
      try {
        // 초기 준비 작업
        await new Promise((resolve) => setTimeout(resolve, 300));
        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        console.warn(error);
      }
    }

    prepareApp();
  }, []);

  const handleSplashFinish = () => {
    setShowCustomSplash(false);
  };

  if (loading || showCustomSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <>{children}</>;
}

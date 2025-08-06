import React, { useEffect, useState } from "react";
import { useAuthBootstrap } from "@/src/modules/user/authBootstrap";
import * as ExpoSplashScreen from "expo-splash-screen";
import { SplashScreen } from "../splash/SplashScreen";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { useLogoStore } from "./logo/LogoStore";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import logoStyle from "./logo/logostyle";

export function SplashScreenController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuthBootstrap();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isPostStep, setIsPostStep] = useState(false);
  const { setLogo } = useLogoStore();

  // Reanimated 값들
  const translateY = useSharedValue(0);
  // const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.logoCenter, // 스타일시트 적용
      transform: [{ translateY: translateY.value }],
    };
  });

  // 로고 스타일을 relative로 변경
  const animatedLogo = (
    <Animated.Image 
      source={require("@/assets/images/logo.png")} 
      style={animatedStyle} // 애니메이션 스타일 직접 적용
    />
  );
  
  useEffect(() => {
    setLogo(animatedLogo);
    
    async function prepareApp() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        console.warn(error);
      }
    }
    prepareApp();
  }, []);

  useEffect(() => { 
    if (isPostStep) {
      const currentTop = logoStyle.logoCenter.top; // 300
      const targetTop = logoStyle.logoLogin.top;   // 300
      const moveDistance = targetTop - currentTop; // 0
      // postProcess 시작 - 화면을 위로 올리는 애니메이션
      translateY.value = withTiming(moveDistance, { duration: 500 },(finished)=>{
        if (finished) {
          runOnJS(setShowCustomSplash)(false);
        }
      });
      // opacity.value = withTiming(0, { duration: 500 }, (finished) => {
      //   if (finished) {
      //     runOnJS(setShowCustomSplash)(false);
      //   }
      // });
    }
  }, [isPostStep]);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: translateY.value }],
  //     // opacity: opacity.value,
  //   };
  // });

  const handleSplashFinish = () => {
    setIsPostStep(true);
  };

  // const animatedLogo = (
  //   <Animated.View style={[animatedStyle]}>
  //     {logo}
  //   </Animated.View>
  // );


  if (loading || showCustomSplash) {
    return (
      <SplashScreen logo={animatedLogo} onFinish={handleSplashFinish} />
    );
  }

  return <>{children}</>;
}
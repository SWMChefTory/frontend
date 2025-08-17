import React, { useEffect, useState } from "react";
import { useAuthBootstrap } from "@/src/modules/user/authBootstrap";
import * as ExpoSplashScreen from "expo-splash-screen";

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  withDelay
} from 'react-native-reanimated';
import logoStyle from "./logo/style/logostyle";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import MainCharacter from "@/src/modules/shared/splash/logo/MainCharacter";
import NearVoice from "@/src/modules/shared/splash/logo/NearVoice";
import FarVoice from "@/src/modules/shared/splash/logo/FarVoice";
import MainText from "@/src/modules/shared/splash/logo/MainText"; 

export function SplashScreenController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuthBootstrap();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isPostStep, setIsPostStep] = useState(false);

  // Reanimated 값들
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const nearVoiceFadeInDuration = 500;
  const farVoiceFadeInDuration = 500;
  const mainTextFadeInDuration = 500;
  const moveUpDuration = 500;
  const scaleInDuration = 500;

  const nearVoiceFadeInStart = 0;
  const farVoiceFadeInStart = nearVoiceFadeInStart + nearVoiceFadeInDuration;
  const mainTextFadeInStart = farVoiceFadeInStart + farVoiceFadeInDuration;
  const scaleInStart = mainTextFadeInStart + mainTextFadeInDuration;
  const moveUpStart = scaleInStart;

  useEffect(()=>{
      async function prepareApp() {
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          await ExpoSplashScreen.hideAsync();
        } catch (error) {
          console.warn(error);
        }
      }
      prepareApp();

      const currentTop = logoStyle.logoCenter.top; // 300
      const targetTop = logoStyle.logoLogin.top;   // 300
      const moveDistance = targetTop - currentTop; // 0
      // postProcess 시작 - 화면을 위로 올리는 애니메이션
      translateY.value = withDelay(moveUpStart, withTiming(moveDistance, { duration: moveUpDuration }));
      scale.value = withDelay(scaleInStart, withTiming(0.8, { duration: scaleInDuration }, (finished)=>{
        if (finished) {
          runOnJS(setShowCustomSplash)(false);
        }
      }));
    }, []);


  if (loading || showCustomSplash) {
    return (
    <View style={styles.outerContainer}>
      <Animated.View style={animatedScaleStyle}>
        <MainCharacter translateY={translateY}/>
        <NearVoice translateY={translateY} fadeStart={nearVoiceFadeInStart} fadeDuration={nearVoiceFadeInDuration}/>
        <FarVoice translateY={translateY} fadeStart={farVoiceFadeInStart} fadeDuration={farVoiceFadeInDuration}/>
        <MainText translateY={translateY} fadeStart={mainTextFadeInStart} fadeDuration={mainTextFadeInDuration}/>
      </Animated.View>
    </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  outerContainer: { 
    flex: 1,
    backgroundColor: COLORS.priamry.main,
  },
});

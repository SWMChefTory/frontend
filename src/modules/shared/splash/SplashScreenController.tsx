import React, { useEffect, useState } from "react";
import { useAuthBootstrap } from "@/src/modules/user/authBootstrap";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useLogoStore } from "./logo/LogoStore";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import logoStyle from "./logo/logostyle";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { Asset } from "expo-asset";

export function SplashScreenController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuthBootstrap();
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [isPostStep, setIsPostStep] = useState(false);
  // const { setLogo } = useLogoStore();

  // Reanimated 값들
  const translateY = useSharedValue(0);
  const translateNearOpacity = useSharedValue(0);
  const translateFarOpacity = useSharedValue(0);
  const cheftoryOpacity = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const logoMainAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.logoCenter, // 스타일시트 적용
      transform: [{ translateY: translateY.value }],
    };
  });
  const voiceNearAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.voiceNear,
      transform: [{ translateY: translateY.value }],
      opacity: translateNearOpacity.value,
    };
  });
  const voiceFarAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.voiceFar,
      transform: [{ translateY: translateY.value }],  
      opacity: translateFarOpacity.value,
    };
  });
  const cheftoryAnimatedStyle = useAnimatedStyle(() => {
    return {
      ...logoStyle.cheftory,
      transform: [{ translateY: translateY.value }],
      opacity: cheftoryOpacity.value,
    };
  });
  const animatedScaleStyle = useAnimatedStyle(() => {
    // console.log('Current scale value:', scale.value); 
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const animatedLogoMain = (
    <Animated.Image 
      source={require("@/assets/images/logo.png")} 
      style={logoMainAnimatedStyle} 
    />
  );
  const animatedVoiceNear = (
    <Animated.Image 
      source={require("@/assets/images/voiceNear.png")} 
      style={voiceNearAnimatedStyle} 
    />
  );
  const animatedVoiceFar = (
    <Animated.Image 
      source={require("@/assets/images/voiceFar.png")} 
      style={voiceFarAnimatedStyle} 
    />
  );

  const cheftory = (
    <Animated.Image 
      source={require("@/assets/images/cheftory.png")} 
      style={cheftoryAnimatedStyle} // 애니메이션 스타일 직접 적용
    />
  );

  // const animatedLogo = (
  //   <>
  //     {animatedLogoMain}
  //     {animatedVoiceNear}
  //     {animatedVoiceFar}
  //   </>
  // );
  
  const banner = (
      <Animated.View style={animatedScaleStyle}>
        {animatedLogoMain}
        {animatedVoiceNear}
        {animatedVoiceFar}
        {cheftory}
      </Animated.View>
  );


  // const banner = (
  //   <>
  //     {animatedLogo}
  //     {cheftory}
  //   </>
  // );

  useEffect(() => {
    // setLogo(banner);
    
    async function prepareApp() {
      try {
        await Asset.loadAsync([
        require('@/assets/images/logo.png'),
        require('@/assets/images/voiceNear.png'),
        require('@/assets/images/voiceFar.png'),
        require('@/assets/images/cheftory.png'),
      ]);
        await new Promise((resolve) => setTimeout(resolve, 300));
        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        console.warn(error);
      }
    }
    prepareApp();
  }, []);

  

  //확대 애니메이션
  useEffect(() => {
     const scaleEvent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      scale.value = withTiming(0.8, { duration: 500 }); // 0.5배로 축소
     }
     scaleEvent();
  }, []);

  useEffect(() => {
    translateNearOpacity.value = withTiming(1, { duration: 500 });
    setTimeout(() => {
      translateFarOpacity.value = withTiming(1, { duration: 500 });
    }, 500);
    setTimeout(() => {
      cheftoryOpacity.value = withTiming(1, { duration: 500 });
    }, 1000);
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
    }
  }, [isPostStep]);


  //위로 올리는 애니메이션
  useEffect(() => {
    const stopEvent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsPostStep(true);
    }
    stopEvent();
  }, []);


  if (loading || showCustomSplash) {
    return (
      <View style={styles.outerContainer}>{banner}</View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  outerContainer: { 
    flex: 1,
    backgroundColor: COLORS.priamry.main,
    // ,justifyContent: "center"
    // , alignItems: "center"
    // , backgroundColor: COLORS.priamry.main,
  },
});

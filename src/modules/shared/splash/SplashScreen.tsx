import { View, StyleSheet, Image, Text } from "react-native";
import { useEffect, useState } from "react";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { COLORS } from "../constants/colors";

export function SplashScreen({ logo, onFinish }: { logo: React.ReactNode, onFinish: () => void }) {
  const [showNear, setShowNear] = useState(true);
  const [showFar, setShowFar] = useState(true);
  const [showCheftory, setShowCheftory] = useState(true);

  // useEffect(() => {
  //   // 각 요소들이 나타났다가 사라지는 타이밍 설정
  //   const timers = [
  //     // nearVoice: 1.2초 후 사라지기
  //     setTimeout(() => setShowNear(false), 2000),
      
  //     // farVoice: 1.5초 후 사라지기  
  //     setTimeout(() => setShowFar(false), 2000),
      
  //     // cheftory: 1.8초 후 사라지기
  //     setTimeout(() => setShowCheftory(false), 2000),
      
  //     // 전체 완료: 2초 후
  //     setTimeout(() => onFinish(), 2000),
  //   ];

  //   return () => timers.forEach(clearTimeout);
  // }, []); 

  useEffect(() => {
    setTimeout(() => {
      onFinish();
    }, 2000);
  }, []);

  return (
    <View style={styles.outerContainer}>
      {logo}
      <View style={styles.content}>
        <View style={styles.container}>
        {/* <SplashBackground gradientOpacity={anim.gradientOpacity} /> */}
        {/* <View style={styles.logoContainer}>
          {logo}
        </View> */}
        {/* {showNear && (
            <Animated.View 
              style={styles.nearContainer}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(300)}
            >
              <Image source={require("@/assets/images/voiceNear.png")} />
            </Animated.View>
          )} */}
          
          {/* farVoice - 나타났다가 사라짐 */}
          {/* {showFar && (
            <Animated.View 
              style={styles.farContainer}
              entering={FadeIn.delay(500).duration(500)}
              exiting={FadeOut.duration(300)}
            >
              <Image source={require("@/assets/images/voiceFar.png")} />
            </Animated.View>
          )} */}
        </View>
        
        {/* cheftory - 나타났다가 사라짐 */}
        {/* {showCheftory && (
          <Animated.View 
            style={styles.cheftoryAnimation}
            entering={FadeIn.delay(1000).duration(500)}
            exiting={FadeOut.duration(300)}
          >
            <Image source={require("@/assets/images/mainText.png")} style={styles.cheftory} />
          </Animated.View>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { 
    flex: 1,
    backgroundColor: COLORS.priamry.main,
    // ,justifyContent: "center"
    // , alignItems: "center"
    // , backgroundColor: COLORS.priamry.main,
  },
  container: { justifyContent: "center", alignItems: "center", height: 300,width: 300 },
  // content: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: {
    width: 200,
    height: 200,
    // alignSelf: "center",
    // marginBottom: 100,
    // marginRight: 50,
  },
  nearContainer:{
    width: 15,
    height: 45,
    marginBottom: 100,
    marginRight: 50,
    position: "absolute",
    top: 93,
    left: 206,
  },
  farContainer:{
    width: 15,
    height: 45,
    marginBottom: 100,
    marginRight: 50,
    position: "absolute",
    top: 112,
    left: 216,
  },
  square: {
    width: 200,           // 네모 너비
    height: 200,          // 네모 높이  
    backgroundColor: '#3498db',  // 파란색 배경
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,     // 둥근 모서리 (선택사항)
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    // marginBottom: 100,
    marginRight: 30,
  },
  cheftoryAnimation:{
    // width: 200,
    // height: 50,
    marginTop: -40,
    // alignSelf: "center",
    // marginBottom: 100,
    // marginRight: 50,
  },
  cheftory:{
    width: 200,
    height: 50,
    
    // alignSelf: "center",
    // marginBottom: 100,
    // marginRight: 50,
  },
  content:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  logoContainer:{
    // width: 170,
    // height: 160,
    // alignSelf: "center",
    // marginBottom: 100,
    // marginRight: 30,
    paddingRight:20,
  },
});

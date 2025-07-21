import { View, StyleSheet } from "react-native";
import { useSplashAnimation } from "./useSplashAnimation";
import SplashBackground from "./SplashBackground";
import SplashLogo from "./SplashLogo";
import SplashTextSection from "./SplashTextSection";
import { useEffect } from "react";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const anim = useSplashAnimation(onFinish);
  useEffect(() => {
    return () => {
      Object.values(anim).forEach((animation) => {
        if (animation && typeof animation.stopAnimation === "function") {
          animation.stopAnimation();
        }
      });
    };
  }, [anim]);
  return (
    <View style={styles.container}>
      <SplashBackground gradientOpacity={anim.gradientOpacity} />
      <View style={styles.content}>
        <SplashLogo
          translateY={anim.logoTranslateY}
          scale={anim.logoScale}
          opacity={anim.logoOpacity}
          yellowDot={anim.yellowDot}
          greenDot={anim.greenDot}
          yellowFloat={anim.yellowFloat}
        />
        <SplashTextSection
          titleOpacity={anim.titleOpacity}
          subtitleOpacity={anim.subtitleOpacity}
          dotsOpacity={anim.dotsOpacity}
          dot1={anim.dot1}
          dot2={anim.dot2}
          dot3={anim.dot3}
          title="쉐프토리"
          subtitle="맛있는 레시피를 준비하고 있어요"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
});

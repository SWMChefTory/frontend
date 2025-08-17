import { useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/src/modules/shared/constants/colors";

export function HomeHeader() {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const decorativeOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(decorativeOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(decorativeOpacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1.05,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogoPress = () => {
    Animated.sequence([
      Animated.timing(pulseValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"],
  });

  return (
    <Animated.View
      style={[styles.headerContainer, { transform: [{ scale: scaleValue }] }]}
    >
      {/* 로고 */}
      <TouchableOpacity
        style={styles.logoContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleLogoPress}
        activeOpacity={0.8}
      >
        {/* <Animated.View
          style={[
            styles.logoBackground,
            { transform: [{ scale: pulseValue }] },
          ]}
        >
          <LinearGradient
            colors={[COLORS.priamry.cook, COLORS.priamry.cook]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBackground}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </LinearGradient>
        </Animated.View> */}

        <View style={styles.titleContainer}>
          {/* <Text style={styles.titleGradient}>쉐프토리</Text>
          <View style={styles.taglineContainer}> */}
            {/* <Animated.View
              style={[styles.dot, { transform: [{ scale: pulseValue }] }]}
            /> */}
            {/* <Text style={styles.tagline}>요리의 시작</Text>
          </View> */}
          <Image
              source={require("@/assets/images/mainText.png")}
              style={{ width: 80, height: 50 }}
              resizeMode="contain"
            />
        </View>
      </TouchableOpacity>

      {/* 장식 요소 */}
      {/* <View style={styles.decorativeElements}>
        <Animated.View
          style={[
            styles.decorativeDot,
            {
              backgroundColor: COLORS.orange.main + "30",
              opacity: decorativeOpacity,
              transform: [{ scale: pulseValue }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeDot,
            {
              backgroundColor: COLORS.orange.main + "50",
              opacity: decorativeOpacity,
              marginLeft: 4,
              transform: [{ scale: pulseValue }],
            },
          ]}
        />
      </View> */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBackground: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    paddingLeft: 10,
    justifyContent: "center",
  },
  titleGradient: {
    // fontFamily:"DoHyeon_400Regular",
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.orange.main,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.orange.main,
    marginRight: 6,
  },
  tagline: {
    fontFamily: "NotoSerifKR_400Regular",
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    letterSpacing: 0.2,
    marginLeft: 2,
  },
  decorativeElements: {
    flexDirection: "row",
    alignItems: "center",
  },
  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

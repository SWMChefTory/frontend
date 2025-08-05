import { useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";

export function AllPopularRecipeTitle() {
  // 클릭 기반 애니메이션값들
  const scaleValue = useRef(new Animated.Value(1)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  // 자동 애니메이션값들 (HomeHeader처럼)
  const sparkleOpacity = useRef(new Animated.Value(0.4)).current;
  const decorativeOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // HomeHeader처럼 자동으로 실행되는 애니메이션만 남기기
    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    const decorativeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(decorativeOpacity, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(decorativeOpacity, {
          toValue: 0.3,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );

    sparkleAnimation.start();
    decorativeAnimation.start();

    return () => {
      sparkleAnimation.stop();
      decorativeAnimation.stop();
    };
  }, []);

  // 클릭 애니메이션들 (HomeHeader 스타일)
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

  // 클릭 시 특별한 애니메이션
  const handleTitlePress = () => {
    // 아이콘 회전
    Animated.timing(iconRotate, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      iconRotate.setValue(0); // 리셋
    });

    // 전체 펄스
    Animated.sequence([
      Animated.timing(pulseValue, {
        toValue: 1.1,
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

  const iconRotateInterpolate = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // 한 바퀴 회전
  });

  return (
    <Animated.View
      style={[
        styles.titleContainer,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.touchableContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleTitlePress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [{ scale: pulseValue }],
            },
          ]}
        >
          {/* 메인 타이틀 섹션 */}
          <View style={styles.mainTitleWrapper}>
            {/* 회전하는 트렌딩 아이콘 */}
            <Animated.View
              style={{
                transform: [{ rotate: iconRotateInterpolate }],
              }}
            >
              <Ionicons
                name="trending-up"
                size={22}
                color={COLORS.orange.main}
              />
            </Animated.View>

            {/* 타이틀 텍스트 */}
            <Text style={styles.mainTitle}>인기 레시피</Text>

            {/* 반짝이는 장식들 */}
            <View style={styles.decorationsContainer}>
              <Animated.View
                style={[styles.sparkleIcon, { opacity: sparkleOpacity }]}
              >
                <Ionicons
                  name="sparkles"
                  size={16}
                  color={COLORS.orange.light}
                />
              </Animated.View>
            </View>
          </View>

          {/* 서브타이틀 섹션 */}
          <View style={styles.subtitleWrapper}>
            <Animated.View
              style={[
                styles.pulsingDot,
                {
                  transform: [{ scale: pulseValue }],
                },
              ]}
            />
            <Text style={styles.subtitle}>최고의 요리들</Text>

            {/* 작은 장식 도트들 */}
            <View style={styles.smallDotsContainer}>
              <Animated.View
                style={[
                  styles.smallDot,
                  {
                    opacity: decorativeOpacity,
                    backgroundColor: COLORS.orange.main + "50",
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.smallDot,
                  {
                    opacity: sparkleOpacity,
                    backgroundColor: COLORS.orange.main + "70",
                    marginLeft: 3,
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    paddingVertical: 6,
  },
  touchableContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  contentContainer: {
    alignItems: "center",
  },
  mainTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8, // RN 0.71+ 지원
    paddingBottom: 2,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text.black,
    letterSpacing: -0.4,
    textShadowColor: COLORS.orange.main + "15",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  decorationsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
  },
  sparkleIcon: {
    paddingTop: 1,
  },
  subtitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
  },
  pulsingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.orange.main,
    marginRight: 8,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.text.gray,
    fontWeight: "500",
    letterSpacing: 0.4,
  },
  smallDotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
  },
  smallDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});

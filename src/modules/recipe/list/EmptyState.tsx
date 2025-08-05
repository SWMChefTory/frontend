import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  buttonText: string;
  onRefresh: () => void;
}

export const AllRecipeEmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  iconName,
  buttonText,
  onRefresh,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const decorativeAnim1 = useRef(new Animated.Value(0)).current;
  const decorativeAnim2 = useRef(new Animated.Value(0)).current;
  const decorativeAnim3 = useRef(new Animated.Value(0)).current;

  // 컴포넌트 마운트 시 애니메이션 시작
  useEffect(() => {
    // 메인 컨텐츠 페이드인 & 스케일업
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // 아이콘 부드러운 회전 애니메이션
    const iconRotation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconRotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    );

    // 아이콘 플로팅 애니메이션
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    // 장식 원들의 스케일 애니메이션 (서로 다른 타이밍)
    const decorativeAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(decorativeAnim1, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(decorativeAnim1, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    );

    const decorativeAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(decorativeAnim2, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(decorativeAnim2, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ]),
    );

    const decorativeAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.timing(decorativeAnim3, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(decorativeAnim3, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: true,
        }),
      ]),
    );

    // 애니메이션 시작 (각각 다른 지연 시간)
    setTimeout(() => iconRotation.start(), 500);
    setTimeout(() => floating.start(), 800);
    setTimeout(() => decorativeAnimation1.start(), 1000);
    setTimeout(() => decorativeAnimation2.start(), 1200);
    setTimeout(() => decorativeAnimation3.start(), 1400);

    return () => {
      iconRotation.stop();
      floating.stop();
      decorativeAnimation1.stop();
      decorativeAnimation2.stop();
      decorativeAnimation3.stop();
    };
  }, [
    fadeAnim,
    scaleAnim,
    iconRotateAnim,
    floatAnim,
    decorativeAnim1,
    decorativeAnim2,
    decorativeAnim3,
  ]);

  // 새로고침 버튼 애니메이션
  const handleRefresh = useCallback(() => {
    // 버튼 클릭 시 피드백 애니메이션
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    onRefresh();
  }, [onRefresh, scaleAnim]);

  // 애니메이션 계산
  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"],
  });

  const iconFloat = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const decorativeScale1 = decorativeAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const decorativeScale2 = decorativeAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const decorativeScale3 = decorativeAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.emptyContent}>
        {/* 애니메이션되는 배경 장식 원들 */}
        <Animated.View
          style={[
            styles.decorativeCircle1,
            {
              transform: [{ scale: decorativeScale1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeCircle2,
            {
              transform: [{ scale: decorativeScale2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.decorativeCircle3,
            {
              transform: [{ scale: decorativeScale3 }],
            },
          ]}
        />

        {/* 애니메이션되는 메인 아이콘 */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ translateY: iconFloat }, { rotate: iconRotation }],
            },
          ]}
        >
          <View style={styles.iconBackground}>
            <Ionicons name={iconName} size={36} color={COLORS.orange.main} />
          </View>
        </Animated.View>

        {/* 텍스트 */}
        <View style={styles.textContainer}>
          <Text style={styles.emptyTitle}>{title}</Text>
          <Text style={styles.emptySubtitle}>{subtitle}</Text>
        </View>

        {/* 인터렉티브 새로고침 버튼 */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="refresh-outline"
              size={18}
              color={COLORS.orange.main}
            />
            <Text style={styles.buttonText}>{buttonText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: COLORS.background.white,
  },
  emptyContent: {
    position: "relative",
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    paddingVertical: 48,
    paddingHorizontal: 32,
    backgroundColor: COLORS.background.white,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.background.white,
    // 부드러운 그림자
    shadowColor: COLORS.orange.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  // 배경 장식 원들
  decorativeCircle1: {
    position: "absolute",
    top: -20,
    right: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 183, 77, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -10,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 138, 101, 0.08)",
  },
  decorativeCircle3: {
    position: "absolute",
    top: 20,
    left: -30,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(251, 146, 60, 0.12)",
  },
  iconContainer: {
    marginBottom: 28,
  },
  iconBackground: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.background.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(251, 146, 60, 0.15)",
    // 부드러운 내부 그림자 효과
    shadowColor: "#FF8A65",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.black,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.text.gray,
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  refreshButton: {
    borderRadius: 20,
    backgroundColor: COLORS.background.white,
    borderWidth: 1,
    borderColor: COLORS.orange.light,
    // 부드러운 그림자
    shadowColor: COLORS.orange.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: COLORS.orange.main,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
    letterSpacing: -0.1,
  },
});

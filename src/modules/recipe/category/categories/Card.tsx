import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DraxView } from "react-native-drax";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { Category } from "../Category";
import { CategoryState, CategorySelectedState } from "./State";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

interface BaseProps {
  category: Category;
  onPress: (category: Category) => void;
  onDelete: (category: Category) => void;
  categorySelectedState: CategorySelectedState;
}

interface DropProps {
  category: Category;
  onDrop: (recipeId: string, recipeCategoryId: string | null, categoryId: string) => void;
}

interface SuccessProps {
  category: Category;
}

// 공통 스타일
const baseStyles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    ...SHADOW
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF3F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.black,
    marginBottom: 4,
    textAlign: "center",
  },
  count: {
    fontSize: 11,
    color: COLORS.text.gray,
  },
  deleteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

// 드래그 가이드 스타일
const styles = StyleSheet.create({
  arrowContainer: {
    position: "absolute",
    top: 10,
    alignItems: "center",
  },
  dragGuideText: {
    position: "absolute",
    bottom: 25,
    fontSize: 8,
    color: "rgba(255, 107, 53, 0.8)",
    fontWeight: "600",
    textAlign: "center",
  },
  plusIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 8,
  },
});

// 1. 기본 카드 컴포넌트
export function NormalCategoryCard({ category, onPress, onDelete, categorySelectedState }: BaseProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={baseStyles.container}>
        <TouchableOpacity
          style={baseStyles.content}
          onPress={() => onPress(category)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={baseStyles.iconContainer}>
            <Ionicons
              name="folder"
              size={24}
              color={categorySelectedState === CategorySelectedState.SELECTED ? COLORS.priamry.cook : COLORS.orange.main}
            />
          </View>
          <Text style={baseStyles.name} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={baseStyles.count}>{category.count}개</Text>
        </TouchableOpacity>

        <TouchableOpacity style={baseStyles.deleteButton} onPress={() => onDelete(category)}>
          <Ionicons name="close" size={14} color={COLORS.text.gray} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// 2. 드래그 중일 때 카드 (드롭 타겟)
export function DroppableCategoryCard({ category, onDrop }: DropProps) {
  const [isReceiving, setIsReceiving] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const guideOpacityAnim = useRef(new Animated.Value(0)).current;
  const arrowBounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 드래그 중일 때 살짝 커지는 효과
    Animated.spring(scaleAnim, {
      toValue: 1.005,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    // 드래그 가이드 표시
    Animated.timing(guideOpacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 화살표 바운스 애니메이션
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowBounceAnim, {
          toValue: -5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(arrowBounceAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    bounceLoop.start();

    return () => {
      scaleAnim.setValue(1);
      guideOpacityAnim.setValue(0);
      bounceLoop.stop();
      arrowBounceAnim.setValue(0);
    };
  }, []);

  const startReceiving = () => {
    setIsReceiving(true);
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.01,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
  };

  const endReceiving = () => {
    setIsReceiving(false);
    pulseAnim.stopAnimation();
    Animated.spring(pulseAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  const handleDrop = (event: any) => {
    const payload = event.dragged.payload;
    console.log("payload", payload);

    let recipeId: string;
    let recipeCategoryId: string | null = null;

    if (typeof payload === "string") {
      recipeId = payload;
    } else if (payload && typeof payload === "object") {
      recipeId = payload[0];
      recipeCategoryId = payload[1] || null;
    } else {
      return;
    }

    endReceiving();
    onDrop(recipeId, recipeCategoryId, category.id);
  };

  // 드래그 중일 때와 드래그 아이템이 위에 올라왔을 때 다른 스타일
  const containerStyle = [
    baseStyles.container,
    {
      // 기본 드래그 중 스타일 (점선 테두리)
      borderColor: isReceiving ? COLORS.orange.main : "rgba(255, 107, 53, 0.8)",
      borderWidth: 2,
      borderStyle: isReceiving ? "solid" : "dashed",
      backgroundColor: isReceiving
        ? "rgba(255, 165, 0, 0.15)"
        : "rgba(255, 107, 53, 0.05)",
      shadowColor: isReceiving ? COLORS.orange.main : "rgba(255, 107, 53, 0.3)",
      shadowOpacity: isReceiving ? 0.4 : 0.2,
      shadowRadius: isReceiving ? 8 : 6,
      elevation: isReceiving ? 8 : 6,
    },
  ];

  return (
    <Animated.View style={{ transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] }}>
      <DraxView
        style={containerStyle as any}
        onReceiveDragEnter={startReceiving}
        onReceiveDragExit={endReceiving}
        onReceiveDragDrop={handleDrop}
      >
        <View style={baseStyles.content}>
          <View
            style={[
              baseStyles.iconContainer,
              isReceiving ? {
                backgroundColor: COLORS.orange.main,
              } : {
                backgroundColor: "rgba(255, 107, 53, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(255, 107, 53, 0.3)",
                borderStyle: "dashed",
              },
            ]}
          >
            <Ionicons
              name="folder"
              size={24}
              color={
                isReceiving
                  ? COLORS.text.white
                  : COLORS.orange.main
              }
            />
          </View>
          <Text
            style={[
              baseStyles.name,
              isReceiving
                ? { color: COLORS.orange.main, fontWeight: "700" }
                : { color: COLORS.orange.main, fontWeight: "600" },
            ]}
            numberOfLines={1}
          >
            {category.name}
          </Text>
          <Text
            style={[
              baseStyles.count,
              { color: COLORS.orange.main },
            ]}
          >
            {category.count}개
          </Text>
        </View>
        {/* 드래그 가이드 오버레이 */}
        {!isReceiving && (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                justifyContent: "center",
                alignItems: "center",
                opacity: guideOpacityAnim,
                pointerEvents: "none",
              },
            ]}
          >
            {/* 화살표들 */}
            <View style={styles.arrowContainer}>
              <Animated.View
                style={{
                  transform: [{ translateY: arrowBounceAnim }],
                }}
              >
                <Ionicons name="arrow-down" size={16} color="rgba(255, 107, 53, 0.6)" />
              </Animated.View>
            </View>

            {/* 더하기 아이콘 */}
            <View style={styles.plusIconContainer}>
              <Ionicons name="add-circle-outline" size={20} color="rgba(255, 107, 53, 0.7)" />
            </View>
          </Animated.View>
        )}
      </DraxView>
    </Animated.View>
  );
}

// 3. 삭제 중인 카드
export function DeletingCategoryCard({ category }: Pick<BaseProps, 'category'>) {
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 셰이크 + 페이드 효과
    const shake = Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.02, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.01, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 200, useNativeDriver: true }),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
      ])
    );

    shake.start();
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }],
      opacity: opacityAnim,
    }}>
      <View style={[
        baseStyles.container,
        {
          backgroundColor: "rgba(255, 99, 99, 0.1)",
          borderColor: "#FF6B6B",
          borderWidth: 2,
        },
      ]}>
        <View style={baseStyles.content}>
          <View style={[baseStyles.iconContainer, { backgroundColor: "#F5F5F5" }]}>
            <Ionicons name="folder" size={24} color={COLORS.text.gray} />
          </View>
          <Text style={[baseStyles.name, { color: COLORS.text.gray, opacity: 0.6 }]} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={[baseStyles.count, { opacity: 0.6 }]}>{category.count}개</Text>
        </View>

        <View style={[baseStyles.deleteButton, { backgroundColor: "rgba(255, 0, 0, 0.1)" }]}>
          <ActivityIndicator size="small" color={COLORS.text.gray} />
        </View>

        {/* 삭제 오버레이 */}
        <View style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 12,
          },
        ]}>
          <ActivityIndicator size="small" color="#FF6B6B" style={{ marginBottom: 4 }} />
          <Text style={{ fontSize: 11, color: "#FF6B6B", fontWeight: "700" }}>삭제 중...</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// 4. 업데이트 중인 카드
export function UpdatingCategoryCard({ category }: Pick<BaseProps, 'category'>) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 스케일 다운
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 펄스 루프
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.95, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{
      transform: [
        { scale: Animated.multiply(scaleAnim, pulseAnim) },
        { rotate },
      ],
    }}>
      <View style={[
        baseStyles.container,
        {
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          borderColor: "#3498DB",
          borderWidth: 2,
        },
      ]}>
        <View style={baseStyles.content}>
          <View style={[baseStyles.iconContainer, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="folder" size={24} color="#3498DB" />
          </View>
          <Text style={[baseStyles.name, { color: "#3498DB", fontWeight: "600" }]} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={[baseStyles.count, { color: "#3498DB" }]}>{category.count}개</Text>
        </View>

        {/* 업데이트 오버레이 */}
        <View style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 12,
          },
        ]}>
          <ActivityIndicator size="small" color="#3498DB" style={{ marginBottom: 4 }} />
          <Text style={{ fontSize: 11, color: "#3498DB", fontWeight: "700" }}>업데이트 중...</Text>
        </View>
      </View>
    </Animated.View>
  );
}


// 6. 성공 애니메이션 카드
export function SuccessCategoryCard({ category }: SuccessProps) {
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(successAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const successScale = successAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 1],
  });

  return (
    <View style={baseStyles.container}>
      <View style={baseStyles.content}>
        <View style={baseStyles.iconContainer}>
          <Ionicons name="folder" size={24} color={COLORS.orange.main} />
        </View>
        <Text style={baseStyles.name} numberOfLines={1}>{category.name}</Text>
        <Text style={baseStyles.count}>{category.count}개</Text>
      </View>

      {/* 성공 오버레이 */}
      <Animated.View style={[
        StyleSheet.absoluteFillObject,
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 12,
          opacity: successAnim,
          transform: [{ scale: successScale }],
        },
      ]}>
        <Ionicons name="checkmark-circle" size={32} color={COLORS.orange.main} />
      </Animated.View>
    </View>
  );
}

interface CategoryCardProps extends BaseProps, DropProps {
  categoryState: CategoryState;
  categorySelectedState: CategorySelectedState;
}

export function CategoryCard({
  category,
  onDrop,
  onDelete,
  onPress,
  categorySelectedState,
  categoryState,
  }: CategoryCardProps) {

  if (categoryState === CategoryState.DELETING) {
    return <DeletingCategoryCard category={category} />;
  }

  if (categoryState === CategoryState.UPDATING) {
    return <UpdatingCategoryCard category={category} />;
  }

  if (categoryState === CategoryState.SUCCESS) {
      return <SuccessCategoryCard category={category}/>;
  }

  if (categoryState === CategoryState.DRAGGING && categorySelectedState === CategorySelectedState.UNSELECTED) {
    return (
      <DroppableCategoryCard
        category={category}
        onDrop={onDrop}
      />
    );
  }

  return (
    <NormalCategoryCard
      category={category}
      onPress={onPress}
      onDelete={onDelete}
      categorySelectedState={categorySelectedState}
    />
  );
}
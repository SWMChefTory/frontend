import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { CARD_STYLES } from "@/src/modules/shared/constants/card";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";
import { RecentRecipe, RecipeStatus } from "@/src/modules/recipe/types/Recipe";
import { useEffect, useRef } from "react";
type Props = {
  recipe: RecentRecipe;
  onPress: (recipe: RecentRecipe) => void;
};

export function RecentRecipeSummaryCard({ recipe, onPress }: Props) {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const isInProgress = recipe.recipeStatus === RecipeStatus.IN_PROGRESS;

  // 진행중일 때 셰이머 애니메이션
  useEffect(() => {
    if (isInProgress) {
      // 셰이머 효과 - 네이티브 드라이버 사용
      const shimmer = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true, // ✅ 네이티브 사용
        }),
      );

      // 진행률 바 - 네이티브 드라이버 사용하고 범위 축소
      const progressLoop = Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1800, // 조금 더 빠르게
          useNativeDriver: true, // ✅ 네이티브 사용
        }),
      );

      shimmer.start();
      progressLoop.start();

      return () => {
        shimmer.stop();
        progressLoop.stop();
      };
    } else {
      shimmerAnim.setValue(-1);
      progressAnim.setValue(0);
    }
  }, [isInProgress]);

  return (
    <Pressable
      style={[styles.card, isInProgress && styles.cardInProgress]}
      onPress={() => !isInProgress && onPress(recipe)}
      disabled={isInProgress}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: recipe.thumbnailUrl }} style={styles.image} />

          {/* 진행중 셰이머 오버레이 */}
          {isInProgress && (
            <View style={styles.shimmerOverlay}>
              <Animated.View
                style={[
                  styles.shimmerLayer,
                  {
                    transform: [
                      {
                        translateX: shimmerAnim.interpolate({
                          inputRange: [-1, 1],
                          outputRange: [
                            -responsiveWidth(300),
                            responsiveWidth(300),
                          ],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Text style={styles.progressStatus}>
                AI가 레시피를 만들고 있어요
              </Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text
            numberOfLines={1}
            style={[styles.title, isInProgress && styles.titleInProgress]}
          >
            {recipe.title}
          </Text>

          <View style={styles.progressBg}>
            {isInProgress ? (
              // 진행중일 때 애니메이션 바
              <Animated.View
                style={[
                  styles.progressFgAnimated,
                  {
                    transform: [
                      {
                        translateX: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            -responsiveWidth(200),
                            responsiveWidth(200),
                          ],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ) : (
              // 일반 진행률 바
              <View
                style={[
                  styles.progressFg,
                  {
                    width: `${Math.min((recipe.lastPlaySeconds / recipe.videoDuration) * 100, 100)}%`,
                  },
                ]}
              />
            )}
          </View>

          <Text
            style={[
              styles.progressText,
              isInProgress && styles.progressTextInProgress,
            ]}
          >
            {isInProgress ? "생성중..." : `${recipe.getTimeAgo()} 시청됨`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES.medium_horizontal,
  },
  cardInProgress: {
    borderWidth: 1,
    borderColor: COLORS.background.orange,
    backgroundColor: "rgba(255, 131, 0, 0.02)",
  },
  cardContent: {
    width: "100%",
    height: "100%",
  },
  imageWrapper: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    borderRadius: CARD_STYLES.medium_horizontal.borderRadius,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 131, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: CARD_STYLES.medium_horizontal.borderRadius,
    overflow: "hidden",
  },
  shimmerLayer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: responsiveWidth(100),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ skewX: "-20deg" }],
  },
  progressIndicator: {
    width: responsiveWidth(44),
    height: responsiveWidth(44),
    borderRadius: responsiveWidth(22),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(10),
  },
  progressIndicatorText: {
    fontSize: responsiveFontSize(20),
  },
  progressStatus: {
    color: "white",
    fontSize: responsiveFontSize(11),
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: responsiveWidth(12),
    lineHeight: responsiveHeight(14),
  },
  body: {
    paddingHorizontal: responsiveWidth(12),
    paddingTop: responsiveHeight(12),
  },
  title: {
    fontSize: responsiveFontSize(13),
    fontWeight: "600",
    color: COLORS.text.black,
    lineHeight: responsiveHeight(18),
  },
  titleInProgress: {
    color: COLORS.background.orange,
  },
  progressBg: {
    width: "100%",
    height: responsiveHeight(3),
    backgroundColor: COLORS.background.lightGray,
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(6),
    overflow: "hidden",
  },
  progressFg: {
    height: "100%",
    backgroundColor: COLORS.background.orange,
    borderRadius: 2,
  },
  progressFgAnimated: {
    height: "100%",
    width: responsiveWidth(50),
    backgroundColor: COLORS.background.orange,
    borderRadius: 2,
    opacity: 0.7,
  },
  progressText: {
    fontSize: responsiveFontSize(11),
    color: COLORS.text.gray,
    marginTop: responsiveHeight(4),
    fontWeight: "500",
  },
  progressTextInProgress: {
    color: COLORS.background.orange,
    fontWeight: "600",
  },
});

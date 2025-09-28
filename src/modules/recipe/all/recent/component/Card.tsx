import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RecentRecipe, RecipeStatus } from "@/src/modules/recipe/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";

type Props = {
  recipe: RecentRecipe;
  onPress: (recipe: RecentRecipe) => void;
};

export function AllRecentRecipeCard({ recipe, onPress }: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const isInProgress = recipe.recipeStatus === RecipeStatus.IN_PROGRESS;

  useEffect(() => {
    if (isInProgress) {
      const shimmer = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      );

      const progressLoop = Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
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
    <View style={[styles.card, isInProgress && styles.cardInProgress]}>
      <Pressable
        style={styles.cardContent}
        onPress={() => !isInProgress && onPress(recipe)}
        disabled={isInProgress}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: recipe.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.sourceIndicator}>
            <Ionicons name="logo-youtube" size={16} color="#FF0000" />
          </View>

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
                            -responsiveWidth(200),
                            responsiveWidth(200),
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

        <View style={styles.infoContainer}>
          <Text
            numberOfLines={2}
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
                            -responsiveWidth(100),
                            responsiveWidth(100),
                          ],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ) : (
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

          {!isInProgress ? (
            <Pressable
              onPress={() => onPress(recipe)}
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              style={[
                styles.recipeButton,
                isPressed && styles.recipeButtonPressed,
              ]}
            >
              <Ionicons name="restaurant-outline" size={14} color="white" />
              <Text style={styles.recipeButtonText}>레시피 보기</Text>
              <Ionicons name="chevron-forward" size={12} color="white" />
            </Pressable>
          ) : (
            <View style={styles.loadingButton}>
              <Text style={styles.loadingButtonText}>생성중...</Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    ...SHADOW,
  },
  cardInProgress: {
    borderWidth: 2,
    borderColor: COLORS.background.orange,
    backgroundColor: "rgba(255, 69, 0, 0.02)",
  },
  titleInProgress: {
    color: COLORS.background.orange,
  },
  cardContent: {
    flexDirection: "row",
    padding: responsiveWidth(16),
    gap: responsiveWidth(16),
  },
  thumbnailContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: {
    width: responsiveWidth(160),
    height: responsiveHeight(120),
    borderRadius: 12,
  },
  sourceIndicator: {
    position: "absolute",
    top: responsiveHeight(6),
    right: responsiveWidth(6),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    padding: responsiveWidth(3),
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: responsiveHeight(20),
    marginBottom: responsiveHeight(4),
  },
  titleUnderline: {
    height: responsiveHeight(3),
    backgroundColor: COLORS.orange.main,
    borderRadius: 1.5,
    marginBottom: responsiveHeight(8),
    minWidth: responsiveWidth(2),
  },
  metaContainer: {
    marginBottom: responsiveHeight(12),
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(4),
  },
  watchedAt: {
    fontSize: responsiveFontSize(12),
    color: COLORS.text.gray,
    marginLeft: responsiveWidth(4),
  },
  statusText: {
    fontSize: responsiveFontSize(11),
    color: COLORS.text.gray,
    fontWeight: "500",
  },
  statusTextInProgress: {
    color: COLORS.background.orange,
    fontWeight: "600",
  },
  progressFgAnimated: {
    height: "100%",
    width: responsiveWidth(50),
    backgroundColor: COLORS.background.orange,
    borderRadius: 2,
    opacity: 0.7,
  },
  recipeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.orange.main,
    paddingHorizontal: responsiveWidth(14),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(12),
  },
  recipeButtonPressed: {
    backgroundColor: COLORS.orange.dark,
    transform: [{ scale: 0.96 }],
  },
  recipeButtonText: {
    color: "white",
    fontSize: responsiveFontSize(12),
    fontWeight: "600",
    marginHorizontal: responsiveWidth(6),
  },
  progressText: {
    fontSize: responsiveFontSize(11),
    color: COLORS.text.gray,
    fontWeight: "500",
  },
  progressTextInProgress: {
    color: COLORS.background.orange,
    fontWeight: "600",
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
  loadingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 69, 0, 0.7)",
    paddingHorizontal: responsiveWidth(14),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(12),
  },
  loadingText: {
    fontSize: responsiveFontSize(14),
    marginRight: responsiveWidth(4),
  },
  loadingButtonText: {
    color: "white",
    fontSize: responsiveFontSize(12),
    fontWeight: "600",
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
    borderRadius: 12,
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
    marginBottom: responsiveHeight(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressIndicatorText: {
    fontSize: responsiveFontSize(18),
  },
  progressStatus: {
    color: "white",
    fontSize: responsiveFontSize(10),
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: responsiveWidth(12),
    lineHeight: responsiveHeight(12),
  },
});

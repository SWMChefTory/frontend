import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useState } from "react";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

type Props = {
  recipe: PopularSummaryRecipe;
  onPress: (recipe: PopularSummaryRecipe) => void;
};

export function AllPopularRecipeCard({ recipe, onPress }: Props) {
  const [isPressed, setIsPressed] = useState(false);

  // TOP 3에 따른 색상 결정
  const getTopBadgeColors = (rank: number): [string, string] => {
    switch (rank) {
      case 1:
        return ["#FFD700", "#FFA500"];
      case 2:
        return ["#C0C0C0", "#808080"];
      case 3:
        return ["#CD7F32", "#A0522D"];
      default:
        return [COLORS.orange.main, "#EA580C"];
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* 썸네일 */}
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: recipe.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.sourceIndicator}>
            <Ionicons name="logo-youtube" size={14} color="#FF0000" />
          </View>

          {/* TOP 순위 배지 */}
          <View style={styles.topBadgeContainer}>
            <LinearGradient
              colors={getTopBadgeColors(recipe.rank)}
              style={styles.topBadgeGradient}
            >
              <Ionicons
                name={recipe.rank <= 3 ? "trophy" : "trending-up"}
                size={10}
                color="white"
              />
              <Text style={styles.topText}>TOP</Text>
              <Text style={styles.rankText}>{recipe.rank}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* 정보 */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View style={styles.metaContainer}>
            <View style={styles.popularityContainer}>
              <Ionicons name="trending-up" size={12} color="#9CA3AF" />
              <Text style={styles.popularityText}>인기 레시피</Text>
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{recipe.count}회 조회</Text>
            </View>
          </View>

          <Pressable
            onPress={() => onPress(recipe)}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={[
              styles.recipeButton,
              isPressed && styles.recipeButtonPressed,
            ]}
          >
            <LinearGradient
              colors={[COLORS.orange.main, "#EA580C"]}
              style={styles.recipeButtonGradient}
            >
              <Ionicons name="restaurant-outline" size={14} color="white" />
              <Text style={styles.recipeButtonText}>레시피 보기</Text>
              <Ionicons name="chevron-forward" size={12} color="white" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    ...SHADOW,
  },
  cardContent: {
    padding: 16,
  },
  thumbnailContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    paddingBottom: 16,
  },
  thumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 12,
  },
  sourceIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    padding: 4,
  },
  topBadgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    ...SHADOW
  },
  topBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    marginLeft: 2,
    marginRight: 1,
  },
  rankText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 20,
    paddingBottom: 4,
    height: 50,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  popularityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  popularityText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
    fontWeight: "500",
  },
  countContainer: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  recipeButton: {
    borderRadius: 12,
    shadowColor: COLORS.orange.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeButtonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.3,
    elevation: 5,
  },
  recipeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  recipeButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 6,
  },
});

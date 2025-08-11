import { useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

type Props = {
  recipe: RecentSummaryRecipe;
  onPress: (recipe: RecentSummaryRecipe) => void;
};

export function AllRecentRecipeCard({ recipe, onPress }: Props) {
  const [isPressed, setIsPressed] = useState(false);

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
            <Ionicons name="logo-youtube" size={16} color="#FF0000" />
          </View>
        </View>

        {/* 정보 */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View
            style={[
              styles.titleUnderline,
              {
                width: `${Math.min((recipe.lastPlaySeconds / recipe.videoDuration) * 100, 100)}%`,
              },
            ]}
          />

          <View style={styles.metaContainer}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text style={styles.watchedAt}>{recipe.getTimeAgo()}</Text>
            </View>
            <Text style={styles.statusText}>시청됨</Text>
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
            <Ionicons name="restaurant-outline" size={14} color="white" />
            <Text style={styles.recipeButtonText}>레시피 보기</Text>
            <Ionicons name="chevron-forward" size={12} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    ...SHADOW,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  thumbnailContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: {
    width: 160,
    height: 120,
    borderRadius: 12,
  },
  sourceIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    padding: 3,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 20,
    marginBottom: 4,
  },
  titleUnderline: {
    height: 3,
    backgroundColor: COLORS.orange.main,
    borderRadius: 1.5,
    marginBottom: 8,
    minWidth: 2,
  },
  metaContainer: {
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  watchedAt: {
    fontSize: 12,
    color: COLORS.text.gray,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.text.gray,
    fontWeight: "500",
  },
  recipeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.orange.main,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  recipeButtonPressed: {
    backgroundColor: COLORS.orange.dark,
    transform: [{ scale: 0.96 }],
  },
  recipeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: 6,
  },
});

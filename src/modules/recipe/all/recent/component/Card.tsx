import { useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";

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
});

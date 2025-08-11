import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PopularSummaryRecipe } from "../types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

type Props = {
  recipe: PopularSummaryRecipe;
  onPress: (recipe: PopularSummaryRecipe) => void;
};

export function PopularRecipeSummaryCard({ recipe, onPress }: Props) {
    const getTopBadgeColors = (rank: number): [string, string] => {
    switch (rank) {
      case 1:
        return ["#FFD700", "#FFA500"]; // 골드
      case 2:
        return ["#C0C0C0", "#808080"]; // 실버
      case 3:
        return ["#CD7F32", "#A0522D"]; // 브론즈
      default:
        return [COLORS.orange.main, "#EA580C"]; // 기본 오렌지
    }
  };

  return (
    <Pressable onPress={() => onPress(recipe)} style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: recipe.thumbnailUrl }} style={styles.image} />

        {/* 유튜브 로고 */}
        <View style={styles.sourceIndicator}>
          <Ionicons name="logo-youtube" size={30} color="#FF0000" />
        </View>

        {/* TOP 순위 배지 */}
        <View style={styles.topBadgeContainer}>
          <LinearGradient
            colors={getTopBadgeColors(recipe.rank)}
            style={styles.topBadgeGradient}
          >
            <Ionicons
              name={recipe.rank <= 3 ? "trophy" : "trending-up"}
              size={30} 
              color="white"
            />
            <Text style={styles.topText}>TOP</Text>
            <Text style={styles.rankText}>{recipe.rank}</Text>
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    aspectRatio: 16/9,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    ...SHADOW,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  sourceIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 4,
  },
  topBadgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 16,
  },
  topBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  topText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  rankText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});
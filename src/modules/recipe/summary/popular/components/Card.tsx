import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PopularSummaryRecipe } from "../types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";

type Props = {
  recipe: PopularSummaryRecipe;
  onPress: (recipe: PopularSummaryRecipe) => void;
};

export function PopularRecipeSummaryCard({ recipe, onPress }: Props) {
  // TOP 3 색상 결정
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
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: recipe.thumbnailUrl }} style={styles.image} />

        {/* 유튜브 로고 */}
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

      {/* 제목 */}
      <Text numberOfLines={2} style={styles.cardText}>
        {recipe.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 150,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    shadowColor: COLORS.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border.orangeLight,
  },
  thumbnailContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 12,
  },
  sourceIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    padding: 4,
  },
  topBadgeContainer: {
    position: "absolute",
    top: 6,
    left: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  topBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
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
  cardText: {
    fontSize: 13,
    marginTop: 6,
    height: 36,
    lineHeight: 18,
    color: "#1F2937",
    fontWeight: "500",
  },
});

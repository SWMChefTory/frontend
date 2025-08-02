import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { RecentSummaryRecipe } from "../types/Recipe";

type Props = {
  recipe: RecentSummaryRecipe;
  onPress: (recipe: RecentSummaryRecipe) => void;
};

export function RecentRecipeSummaryCard({ recipe, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(recipe)}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: recipe.thumbnailUrl }} style={styles.image} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {recipe.title}
        </Text>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFg,
              {
                width: `${Math.min(
                  (recipe.lastPlaySeconds / recipe.videoDuration) * 100,
                  100
                )}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{recipe.getTimeAgo()} 시청됨</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: COLORS.priamry.main,
    borderRadius: 16,
    paddingBottom: 12, // ✅ 내부 아래 여백 추가
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageWrapper: {
    width: "100%",
    height: 80,
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  body: {
    paddingHorizontal: 12, // ✅ 수평 padding만 적용
    paddingTop: 12,        // ✅ 위쪽 여백
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text.black,
    lineHeight: 18,
  },
  progressBg: {
    width: "100%",
    height: 3,
    backgroundColor: COLORS.background.lightGray,
    borderRadius: 2,
    marginTop: 6,
  },
  progressFg: {
    height: "100%",
    backgroundColor: COLORS.background.orange,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: COLORS.text.gray,
    marginTop: 4,
    fontWeight: "500",
  },
});
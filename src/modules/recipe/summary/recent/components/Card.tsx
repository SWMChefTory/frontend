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
          <View style={[styles.progressFg, { width: `${recipe.lastPlaySeconds}%` }]} />
        </View>
        <Text style={styles.progressText}>{recipe.viewedAt.toLocaleString()} 시청됨</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginVertical: 8,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    shadowColor: COLORS.shadow.lightOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  cardText: { fontSize: 13 },
  imageWrapper: {
    width: "100%",
    height: 80,
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  body: { padding: 12 },
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

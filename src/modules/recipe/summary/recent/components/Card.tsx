import { Image, Pressable, StyleSheet, Text, View } from "react-native";
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
          <View style={[styles.progressFg, { width: `${recipe.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{recipe.watchedTime} 시청됨</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#ff9800",
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
    color: "#111827",
    lineHeight: 18,
  },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  meta: { fontSize: 12, color: "#6B7280" },
  progressBg: {
    width: "100%",
    height: 3,
    backgroundColor: "#F3F4F6",
    borderRadius: 2,
    marginTop: 6,
  },
  progressFg: {
    height: "100%",
    backgroundColor: "#ff9800",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
});

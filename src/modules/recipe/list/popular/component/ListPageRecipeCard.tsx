import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { PopularSummaryRecipe } from "../../../summary/popular/types/Recipe";

type Props = {
  recipe: PopularSummaryRecipe;
  onPress: (recipe: PopularSummaryRecipe) => void;
};

export function ListPageRecipeCard({ recipe, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(recipe)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {recipe.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 12,
    flexDirection: "column",
    width: "48%",
    marginBottom: 16,
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 0, 0.08)",
  },
  cardPressed: {
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.16,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 112, // 28 * 4 (tailwind h-28)
    borderRadius: 16,
  },
  content: {
    marginTop: 8,
    flex: 1,
  },
  title: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    lineHeight: 20,
  },
});

import { Image, Pressable, StyleSheet, Text } from "react-native";
import { PopularSummaryRecipe } from "../types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";

type Props = {
  recipe: PopularSummaryRecipe;
  onPress: (recipe: PopularSummaryRecipe) => void;
};

export function PopularRecipeSummaryCard({ recipe, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(recipe)} style={styles.card}>
      <Image source={{ uri: recipe.thumbnailUrl }} style={styles.image} />
      <Text numberOfLines={2} style={styles.cardText}>
        {recipe.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 180,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border.orangeLight,
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 13,
    marginTop: 6,
  },
});

import { View, StyleSheet } from "react-native";
import { RecentSummaryRecipe } from "../types/Recipe";
import { RecipeSectionHeader } from "../../shared/components/SectionHeader";
import RecentRecipeSummaryList from "@/src/modules/recipe/summary/recent/components/List";

interface Props {
  recipes: RecentSummaryRecipe[];
  onRecipePress: (recipe: RecentSummaryRecipe) => void;
  onViewAllPress: () => void;
}

export function RecentRecipeSection({
  recipes,
  onRecipePress,
  onViewAllPress,
}: Props) {
  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader
        title="최근 시청한 레시피"
        onPress={onViewAllPress}
      />
      <RecentRecipeSummaryList recipes={recipes} onPress={onRecipePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  recipeSectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 0, 0.08)",
  },
});

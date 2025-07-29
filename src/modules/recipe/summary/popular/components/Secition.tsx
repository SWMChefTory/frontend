import { View, StyleSheet } from "react-native";
import { RecipeSectionHeader } from "../../../summary/shared/components/SectionHeader";
import { PopularSummaryRecipe } from "../../../summary/popular/types/Recipe";
import { PopularRecipeSectionContent } from "./SerctionContent";
import { PopularRecipeError } from "../shared/Fallback";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  onRecipePress: (recipe: PopularSummaryRecipe) => void;
  onViewAllPress: () => void;
  onRefresh: number;
}

export function PopularRecipeSection({ onRecipePress, onViewAllPress, onRefresh }: Props) {
  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader title="추천 레시피" onPress={onViewAllPress} />
      <ApiErrorBoundary fallbackComponent={PopularRecipeError}>
        <PopularRecipeSectionContent onPress={onRecipePress} onRefresh={onRefresh} />
      </ApiErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  recipeSectionCard: {
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.orange.main,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 0, 0.08)",
  },
});

import { View, StyleSheet } from "react-native";
import { RecentSummaryRecipe } from "../types/Recipe";
import { RecipeSectionHeader } from "../../shared/components/SectionHeader";
import { RecentRecipeSectionContent } from "./SerctionContent";
import { RecentRecipeError } from "../shared/Fallback";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";

interface Props {
  onRecipePress: (recipe: RecentSummaryRecipe) => void;
  onViewAllPress: () => void;
  onRefresh: number;
}

export function RecentRecipeSection({ onRecipePress, onViewAllPress, onRefresh }: Props) {
  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader
        title="최근 시청한 레시피"
        onPress={onViewAllPress}
      />
      <ApiErrorBoundary fallbackComponent={RecentRecipeError}>
        <RecentRecipeSectionContent onPress={onRecipePress} onRefresh={onRefresh} />
      </ApiErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  recipeSectionCard: {
    backgroundColor: COLORS.priamry.cook,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
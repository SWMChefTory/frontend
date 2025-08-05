import { View, StyleSheet } from "react-native";
import { RecipeSectionHeader } from "../../../summary/shared/components/SectionHeader";
import { PopularSummaryRecipe } from "../../../summary/popular/types/Recipe";
import { PopularRecipeError } from "../shared/Fallback";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { Suspense, useEffect } from "react";
import { PopularRecipeSummaryList } from "../../../summary/popular/components/List";
import { PopularRecipesSkeleton } from "../shared/Skeleton";
import { usePopularSummaryViewModel } from "../viewmodels/useViewModels";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";

interface Props {
  onRecipePress: (recipe: PopularSummaryRecipe) => void;
  onViewAllPress: () => void;
  onRefresh: number;
}

export function PopularRecipeSection({
  onRecipePress,
  onViewAllPress,
  onRefresh,
}: Props) {
  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader title="추천 레시피" onPress={onViewAllPress} />
      <ApiErrorBoundary fallbackComponent={PopularRecipeError}>
        <Suspense
          fallback={
            <DeferredComponent>
              <PopularRecipesSkeleton />
            </DeferredComponent>
          }
        >
          <PopularRecipeSectionContent
            onPress={onRecipePress}
            onRefresh={onRefresh}
          />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

interface PopularRecipeSectionContentProps {
  onPress: (recipe: PopularSummaryRecipe) => void;
  onRefresh: number;
}

function PopularRecipeSectionContent({
  onPress,
  onRefresh,
}: PopularRecipeSectionContentProps) {
  const { popularRecipes, refetch } = usePopularSummaryViewModel();

  useEffect(() => {
    refetch();
  }, [onRefresh]);

  return (
    <PopularRecipeSummaryList recipes={popularRecipes} onPress={onPress} />
  );
}

const styles = StyleSheet.create({
  recipeSectionCard: {
    backgroundColor: COLORS.priamry.cook,
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

import { StyleSheet, View } from "react-native";
import { CategoryRecipeSummaryList } from "./List";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { CategorySummaryRecipeError } from "./Fallback";
import { useCategoryRecipesViewModel } from "./useViewModel";
import { Suspense } from "react";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { CategoryRecipesSkeleton } from "./Skeleton";

interface Props {
  selectedCategoryId: string | null;
}

export function CategoryRecipeListSection({ selectedCategoryId }: Props) {
  return (
    <View style={styles.recipeSummaryList}>
      <ApiErrorBoundary fallbackComponent={CategorySummaryRecipeError}>
        <Suspense
          fallback={
            <DeferredComponent>
              <CategoryRecipesSkeleton />
            </DeferredComponent>
          }
        >
          <CategoryRecipeListSectionContent
            selectedCategoryId={selectedCategoryId}
          />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

export function CategoryRecipeListSectionContent({
  selectedCategoryId,
}: Props) {
  const { recipes, refetch } = useCategoryRecipesViewModel(selectedCategoryId);

  return (
    <>
      <CategoryRecipeSummaryList recipes={recipes} />
    </>
  );
}

const styles = StyleSheet.create({
  recipeSummaryList: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    padding: 12,
    marginBottom: 24,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
});

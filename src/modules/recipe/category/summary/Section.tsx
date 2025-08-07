import { StyleSheet, View } from "react-native";
import { CategoryRecipeSummaryList } from "./List";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { CategorySummaryRecipeError } from "./Fallback";
import { useCategoryRecipesViewModel } from "./useViewModel";
import { Suspense, useCallback, useRef, useState } from "react";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { CategoryRecipesSkeleton } from "./Skeleton";
import { useFocusEffect, useRouter } from "expo-router";
import { CategorySummaryRecipe } from "@/src/modules/recipe/category/summary/Recipe";
import { throttle } from "lodash";
import { TrashCan } from "./TrashCan";
import { Category } from "../Category";
interface Props {
  selectedCategory: Category | null;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function CategoryRecipeListSection({ selectedCategory, onDragStart, onDragEnd, isDragging }: Props) {
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
            selectedCategory={selectedCategory}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={isDragging}
          />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

export function CategoryRecipeListSectionContent({
  selectedCategory,
  onDragStart,
  onDragEnd,
  isDragging,
}: Props) {
  const { recipes, refetchAll } = useCategoryRecipesViewModel(selectedCategory?.id ?? null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refetchAll();
    }, [refetchAll]),
  );

  const handleRecipePress = useRef(throttle(
    (recipe: CategorySummaryRecipe) => {
    router.push({
      pathname: "/recipe/detail",
      params: {
        recipeId: recipe.recipeId,
        youtubeId: recipe.youtubeId,
        title: recipe.title,
      },
    });
  }, 2000, {
      leading: true,
      trailing: false,
    }),
  ).current;

  return (
    <>
      <CategoryRecipeSummaryList
        recipes={recipes}
        onPress={handleRecipePress}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isDragging={isDragging}
      />
      <TrashCan
        onDragEnd={onDragEnd}
        isDragging={isDragging}
      />
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

import { StyleSheet, View } from "react-native";
import { CategoryRecipeSummaryList } from "./List";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { CategorySummaryRecipeError } from "./Fallback";
import { useCategoryRecipesViewModel } from "../viewmodels/useViewModel";
import { Suspense, useRef } from "react";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { CategoryRecipesSkeleton } from "./Skeleton";
import { useRouter } from "expo-router";
import { CategorySummaryRecipe } from "@/src/modules/recipe/category/summary/types/Recipe";
import { debounce } from "lodash";
import { TrashCan } from "./TrashCan";
import { Category } from "@/src/modules/recipe/category/categories/types/Category";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { useRefreshOnFocus } from "@/src/modules/shared/utils/useRefreshOnFocus";
import {
  responsiveWidth,
  responsiveHeight,
} from "@/src/modules/shared/utils/responsiveUI";
import { track } from "@/src/modules/shared/utils/analytics";
interface Props {
  selectedCategory: Category | null;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function CategoryRecipeListSection({
  selectedCategory,
  onDragStart,
  onDragEnd,
  isDragging,
}: Props) {
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
  const {
    recipes,
    refetchAll,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategoryRecipesViewModel(selectedCategory?.id ?? null);
  const router = useRouter();

  useRefreshOnFocus(refetchAll);

  const handleRecipePress = useRef(
    debounce(
      (recipe: CategorySummaryRecipe) => {
        track.event("click_category_recipe_card");
        router.push({
          pathname: "/recipe/detail",
          params: {
            recipeId: recipe.recipeId,
            youtubeId: recipe.youtubeId,
            title: recipe.title,
          },
        });
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
  ).current;

  return (
    <>
      <CategoryRecipeSummaryList
        recipes={recipes}
        onPress={handleRecipePress}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isDragging={isDragging}
        onEndReached={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
      <TrashCan onDragEnd={onDragEnd} isDragging={isDragging} />
    </>
  );
}

const styles = StyleSheet.create({
  recipeSummaryList: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    padding: responsiveWidth(12),
    marginBottom: responsiveHeight(24),
    ...SHADOW,
  },
});

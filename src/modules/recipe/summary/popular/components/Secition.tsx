import { View, StyleSheet } from "react-native";
import { RecipeSectionHeader } from "../../components/SectionHeader";
import { PopularRecipe } from "@/src/modules/recipe/types/Recipe";
import { PopularRecipeError } from "../shared/Fallback";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { Suspense, useEffect, useRef } from "react";
import { PopularRecipesSkeleton } from "../shared/Skeleton";
import {
  usePopularSummaryViewModel,
  useRecipeCreateViewModel,
} from "../viewmodels/useViewModels";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { CARD_STYLES } from "@/src/modules/shared/constants/card";
import PopularRecipeSummaryList from "./List";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { useRefreshOnFocus } from "@/src/modules/shared/utils/useRefreshOnFocus";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { track } from "@/src/modules/shared/utils/analytics";

interface Props {
  onRefresh: number;
}

export function PopularRecipeSection({ onRefresh }: Props) {
  const router = useRouter();
  const { create } = useRecipeCreateViewModel();

  const handleRecipePress = useRef(
    debounce(
      async (recipe: PopularRecipe) => {
        const recipeId = (await create(recipe.video_url))!.recipe_id;
        track.event("click_popular_recipe_card");
        router.push({
          pathname: "/recipe/create",
          params: { recipeId },
        });
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
  ).current;

  const handleViewAllPress = useRef(
    debounce(
      () => {
        router.push("/recipe/popular");
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
  ).current;

  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader title="인기 레시피" onPress={handleViewAllPress} />
      <ApiErrorBoundary fallbackComponent={PopularRecipeError}>
        <Suspense
          fallback={
            <DeferredComponent>
              <PopularRecipesSkeleton />
            </DeferredComponent>
          }
        >
          <PopularRecipeSectionContent
            onPress={handleRecipePress}
            onRefresh={onRefresh}
          />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

interface PopularRecipeSectionContentProps {
  onPress: (recipe: PopularRecipe) => void;
  onRefresh: number;
}

function PopularRecipeSectionContent({
  onPress,
  onRefresh,
}: PopularRecipeSectionContentProps) {
  const { popularRecipes, refetch } = usePopularSummaryViewModel();

  useRefreshOnFocus(refetch);

  useEffect(() => {
    refetch();
  }, [onRefresh]);

  return (
    <PopularRecipeSummaryList recipes={popularRecipes} onPress={onPress} />
  );
}

const styles = StyleSheet.create({
  recipeSectionCard: {
    ...CARD_STYLES.large,
    paddingVertical: responsiveHeight(24),
    marginBottom: responsiveHeight(24),
    ...SHADOW,
  },
});

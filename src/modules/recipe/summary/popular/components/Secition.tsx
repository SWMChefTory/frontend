import { View, StyleSheet } from "react-native";
import { RecipeSectionHeader } from "../../../summary/shared/components/SectionHeader";
import { PopularSummaryRecipe } from "../../../summary/popular/types/Recipe";
import { PopularRecipeError } from "../shared/Fallback";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { Suspense, useEffect, useRef } from "react";
import { PopularRecipeSummaryList } from "../../../summary/popular/components/List";
import { PopularRecipesSkeleton } from "../shared/Skeleton";
import {
  usePopularSummaryViewModel,
  useRecipeCreateViewModel,
} from "../viewmodels/useViewModels";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { useRouter } from "expo-router";
import { throttle } from "lodash";

interface Props {
  onRefresh: number;
}

export function PopularRecipeSection({ onRefresh }: Props) {
  const router = useRouter();
  const { create } = useRecipeCreateViewModel();

  const handleRecipePress = useRef(throttle(async (recipe: PopularSummaryRecipe) => {
    const recipeId = (await create(recipe.video_url))!.recipe_id;
    router.push({
      pathname: "/recipe/create",
      params: { recipeId },
    });
  }, 2000, {
    leading: true,
    trailing: false,
  })).current;

  const handleViewAllPress = useRef(throttle(() => {
    router.push("/recipe/popular");
  }, 2000, {
    leading: true,
    trailing: false,
  })).current;

  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader title="추천 레시피" onPress={handleViewAllPress} />
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
  }, [onRefresh, refetch]);

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

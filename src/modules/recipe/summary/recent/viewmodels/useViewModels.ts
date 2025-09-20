import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchRecentSummary,
  RecentSummaryRecipesApiResponse,
} from "../api/api";
import { RecentRecipe, RecipeStatus } from "@/src/modules/recipe/types/Recipe";
import { useIsFocused } from "@react-navigation/native";
import { useMemo, useState, useEffect } from "react";

export function useRecentSummaryViewModel(): {
  recentRecipes: RecentRecipe[];
  refetch: () => void;
  hasInProgressRecipes: boolean;
} {
  const isFocused = useIsFocused();
  const [hasInProgressRecipes, setHasInProgressRecipes] = useState(false);

  const { data, refetch } = useSuspenseQuery<RecentSummaryRecipesApiResponse>({
    queryKey: ["recentSummaryRecipes"],
    queryFn: fetchRecentSummary,
    subscribed: isFocused,
    refetchInterval: hasInProgressRecipes ? 3000 : false,
    refetchIntervalInBackground: true,
  });

  const recentRecipes = useMemo(() => {
    return (
      data?.recent_recipes.map((recipe) => RecentRecipe.create(recipe)) || []
    );
  }, [data?.recent_recipes]);

  useEffect(() => {
    const hasProgress = recentRecipes.some(
      (recipe) => recipe.recipeStatus === RecipeStatus.IN_PROGRESS,
    );
    setHasInProgressRecipes(hasProgress);
  }, [recentRecipes]);

  return {
    recentRecipes,
    refetch,
    hasInProgressRecipes,
  };
}

import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import {
  fetchPopularSummary,
  PopularRecipeOverview,
} from "@/src/modules/recipe/summary/popular/api/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export function usePopularSummaryViewModel(): {
  popularRecipes: PopularSummaryRecipe[];
  refetch: () => Promise<any>;
} {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["popularRecipes"],
    queryFn: fetchPopularSummary,
  });

  const popularRecipes =
    data?.recommend_recipes.map(
      (overview: PopularRecipeOverview, index: number) =>
        PopularSummaryRecipe.create(overview, index + 1),
    ) || [];

  return {
    popularRecipes,
    refetch,
  };
}

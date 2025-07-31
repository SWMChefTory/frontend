import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { fetchPopularSummary,PopularRecipeOverview } from "@/src/modules/recipe/summary/popular/api/api";
import { useQuery } from "@tanstack/react-query";

export function usePopularSummaryViewModel(): {
  popularRecipes: PopularSummaryRecipe[];
  loading: boolean;
  refetch: () => Promise<any>;
} {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["popularRecipes"],
    queryFn: fetchPopularSummary,
  });
  
  const popularRecipes =
  data?.recommend_recipes.map((overview: PopularRecipeOverview, index: number) =>
    PopularSummaryRecipe.create(overview, index + 1),
  ) || [];

  return {
    popularRecipes,
    loading: isLoading,
    refetch,
  };
}
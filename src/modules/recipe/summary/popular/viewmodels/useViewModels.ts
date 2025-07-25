import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { fetchPopularSummary } from "@/src/modules/recipe/summary/popular/api/api";
import { useQuery } from "@tanstack/react-query";

export function usePopularSummaryViewModel(): {
  popularRecipes: PopularSummaryRecipe[];
  loading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: ["popularRecipes"],
    queryFn: fetchPopularSummary,
  });
  
  const popularRecipes =
    data?.recommend_recipes.map((overview) =>
      PopularSummaryRecipe.create(overview),
    ) || [];

  return {
    popularRecipes,
    loading: isLoading,
  };
}

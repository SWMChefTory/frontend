import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchRecentSummary } from "../api/api";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";

export function useRecentSummaryViewModel(): {
  recentRecipes: RecentSummaryRecipe[];
  refetch: () => void;
} {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["recentRecipes"],
    queryFn: fetchRecentSummary,
  });

  const recentRecipes =
    data?.recent_recipes.map((recipe) => RecentSummaryRecipe.create(recipe)) ||
    [];

  return {
    recentRecipes,
    refetch,
  };
}

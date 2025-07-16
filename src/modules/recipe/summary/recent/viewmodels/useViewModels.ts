import { useQuery } from "@tanstack/react-query";
import { fetchRecentSummary } from "../api/api";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";

export function useRecentSummaryViewModel(): {
  recentRecipes: RecentSummaryRecipe[];
  loading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: ["recentRecipes"],
    queryFn: fetchRecentSummary,
  });

  const recentRecipes =
    data?.map((recipe) => RecentSummaryRecipe.create(recipe)) || [];

  return {
    recentRecipes,
    loading: isLoading,
  };
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchRecentSummary } from "../api/api";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";
import { useIsFocused } from "@react-navigation/native";

export function useRecentSummaryViewModel(): {
  recentRecipes: RecentSummaryRecipe[];
  refetch: () => void;
} {
  const isFocused = useIsFocused();
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["recentRecipes"],
    queryFn: fetchRecentSummary,
    subscribed: isFocused,
  });

  const recentRecipes =
    data?.recent_recipes.map((recipe) => RecentSummaryRecipe.create(recipe)) ||
    [];

  return {
    recentRecipes,
    refetch,
  };
}

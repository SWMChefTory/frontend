import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchRecentSummary,
  RecentSummaryRecipesApiResponse,
} from "../api/api";
import { RecentRecipe } from "@/src/modules/recipe/types/Recipe";
import { useIsFocused } from "@react-navigation/native";

export function useRecentSummaryViewModel(): {
  recentRecipes: RecentRecipe[];
  refetch: () => void;
} {
  const isFocused = useIsFocused();
  const { data, refetch } = useSuspenseQuery<RecentSummaryRecipesApiResponse>({
    queryKey: ["recentSummaryRecipes"],
    queryFn: fetchRecentSummary,
    subscribed: isFocused,
  });

  const recentRecipes =
    data?.recent_recipes.map((recipe) => RecentRecipe.create(recipe)) || [];

  return {
    recentRecipes,
    refetch,
  };
}

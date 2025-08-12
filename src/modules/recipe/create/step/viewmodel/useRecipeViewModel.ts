import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchRecipe } from "../api/api";
import { useIsFocused } from "@react-navigation/native";
import { Recipe } from "@/src/modules/recipe/create/Recipe";

export function useRecipeViewModel(recipeId: string) {
  const isFocused = useIsFocused();
  const { data } = useSuspenseQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId),
    staleTime: 5 * 60 * 1000,
    subscribed: isFocused,
  });

  const recipe = Recipe.fromApiResponse(data);
  return {
    recipe,
  };
}

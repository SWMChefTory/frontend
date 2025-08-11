import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchCategorizedSummary,
  fetchUnCategorizedSummary,
  type CategorizedRecipesApiResponse,
  type UnCategorizedRecipesApiResponse,
} from "../api";
import { CategorySummaryRecipe } from "./Recipe";
import { useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";

type CategoryRecipesApiResponse =
  | CategorizedRecipesApiResponse
  | UnCategorizedRecipesApiResponse;

export function useCategoryRecipesViewModel(categoryId: string | null) {
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery<CategoryRecipesApiResponse>(
    {
      queryKey: ["categoryRecipes", categoryId],
      queryFn: async () => {
        if (categoryId) {
          return await fetchCategorizedSummary(categoryId);
        } else {
          return await fetchUnCategorizedSummary();
        }
      },
      staleTime: 5 * 60 * 1000,
      subscribed: isFocused,
    },
  );

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["categoryRecipes"]
    });
  }, [queryClient]);

  const recipes: CategorySummaryRecipe[] = (() => {
    if (!data) return [];

    if (categoryId && "categorized_recipes" in data) {
      return data.categorized_recipes.map((recipe) =>
        CategorySummaryRecipe.createCategorized(recipe),
      );
    } else if (!categoryId && "unCategorized_recipes" in data) {
      return data.unCategorized_recipes.map((recipe) =>
        CategorySummaryRecipe.createUncategorized(recipe),
      );
    }

    return [];
  })();

  return {
    recipes,
    refetchAll,
  };
}

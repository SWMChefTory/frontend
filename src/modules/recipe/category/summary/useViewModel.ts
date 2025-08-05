import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchCategorizedSummary,
  fetchUnCategorizedSummary,
  type CategorizedRecipesApiResponse,
  type UnCategorizedRecipesApiResponse,
} from "../api";
import { CategorySummaryRecipe } from "./Recipe";

type CategoryRecipesApiResponse =
  | CategorizedRecipesApiResponse
  | UnCategorizedRecipesApiResponse;

export function useCategoryRecipesViewModel(categoryId: string | null) {
  const { data, refetch, error } = useSuspenseQuery<CategoryRecipesApiResponse>(
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
    },
  );

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
    error,
    refetch,
    isEmpty: recipes.length === 0,
  } as const;
}

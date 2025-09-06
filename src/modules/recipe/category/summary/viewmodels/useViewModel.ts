import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { CategorySummaryRecipe } from "../types/Recipe";
import { useCallback, useMemo } from "react";
import { useIsFocused } from "@react-navigation/native";
import { withMinDelay } from "@/src/modules/shared/utils/delay";
import {
  CategorizedRecipesApiResponse,
  deleteCategoryRecipe as deleteCategoryRecipeApi,
  fetchCategorizedSummary,
  fetchUnCategorizedSummary,
  UnCategorizedRecipesApiResponse,
} from "@/src/modules/recipe/category/summary/api/api";

type CategoryRecipesApiResponse =
  | CategorizedRecipesApiResponse
  | UnCategorizedRecipesApiResponse;

export function useCategoryRecipesViewModel(categoryId: string | null): {
  recipes: CategorySummaryRecipe[];
  refetchAll: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
} {
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();
  
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery<
    CategoryRecipesApiResponse,
    Error,
    InfiniteData<CategoryRecipesApiResponse>,
    string[],
    number
  >({
    queryKey: ["categoryRecipes", categoryId || "uncategorized"],
    queryFn: ({ pageParam = 0 }) => {
      if (categoryId) {
        return fetchCategorizedSummary({ categoryId, page: pageParam });
      } else {
        return fetchUnCategorizedSummary({ page: pageParam });
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.has_next ? lastPage.current_page + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["categoryRecipes"],
    });
  }, [queryClient]);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recipes: CategorySummaryRecipe[] = useMemo(() => {
    return (
      data?.pages.flatMap((page: CategoryRecipesApiResponse) => {
        if (categoryId && "categorized_recipes" in page) {
          return page.categorized_recipes.map((recipe) =>
            CategorySummaryRecipe.createCategorized(recipe),
          );
        } else if (!categoryId && "unCategorized_recipes" in page) {
          return page.unCategorized_recipes.map((recipe) =>
            CategorySummaryRecipe.createUncategorized(recipe),
          );
        }
        return [];
      }) || []
    );
  }, [data, categoryId]);

  return {
    recipes,
    refetchAll,
    fetchNextPage: handleFetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}

export function useDeleteViewModel() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCategoryRecipe } = useMutation({
    mutationFn: async ({
      recipeId,
      categoryId,
    }: {
      recipeId: string;
      categoryId: string;
    }) => withMinDelay(deleteCategoryRecipeApi(recipeId), 500),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({
        queryKey: ["categoryRecipes", categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { deleteCategoryRecipe };
}

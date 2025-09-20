import { useSuspenseInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { fetchRecentAll, RecentAllRecipesApiResponse } from "../api/api";
import { RecentRecipe, RecipeStatus } from "@/src/modules/recipe/types/Recipe";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useRecentAllViewModel(): {
  recentRecipes: RecentRecipe[];
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
} {
  const isFocused = useIsFocused();
  const [hasInProgressRecipes, setHasInProgressRecipes] = useState(false);

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<
      RecentAllRecipesApiResponse,
      Error,
      InfiniteData<RecentAllRecipesApiResponse>,
      (string | boolean)[],
      number
    >({
      queryKey: ["allRecentRecipes"],
      queryFn: ({ pageParam = 0 }) => fetchRecentAll({ page: pageParam }),
      getNextPageParam: (lastPage) => {
        return lastPage.has_next ? lastPage.current_page + 1 : undefined;
      },
      subscribed: isFocused,
      initialPageParam: 0,
      refetchInterval: hasInProgressRecipes ? 3000 : false,
      refetchIntervalInBackground: true,
    });

  const recentRecipes = useMemo(() => {
    return (
      data?.pages.flatMap((page: RecentAllRecipesApiResponse) =>
        page.recent_recipes.map((recipe) => RecentRecipe.create(recipe)),
      ) || []
    );
  }, [data]);

  useEffect(() => {
    const hasProgress = recentRecipes.some(
      (recipe) => recipe.recipeStatus === RecipeStatus.IN_PROGRESS,
    );
    setHasInProgressRecipes(hasProgress);
  }, [recentRecipes]);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    recentRecipes,
    refetch,
    fetchNextPage: handleFetchNextPage,
    hasNextPage: hasNextPage,
    isFetchingNextPage,
  };
}

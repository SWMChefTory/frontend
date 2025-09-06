import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  fetchAllPopularSummary,
  AllPopularRecipeApiResponse,
} from "../api/api";
import { useIsFocused } from "@react-navigation/native";
import { useMemo, useCallback } from "react";
import { PopularRecipe } from "@/src/modules/recipe/types/Recipe";

export function useAllPopularSummaryViewModel(): {
  allPopularRecipes: PopularRecipe[];
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
} {
  const isFocused = useIsFocused();

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<
      AllPopularRecipeApiResponse,
      Error,
      InfiniteData<AllPopularRecipeApiResponse>,
      (string | boolean)[],
      number
    >({
      queryKey: ["allPopularRecipes", isFocused],
      queryFn: ({ pageParam = 0 }) =>
        fetchAllPopularSummary({ page: pageParam }),
      getNextPageParam: (lastPage) => {
        return lastPage.has_next ? lastPage.current_page + 1 : undefined;
      },
      initialPageParam: 0,
    });

  // 모든 페이지의 레시피들을 하나의 배열로 합치기
  const allPopularRecipes = useMemo(() => {
    return (
      data?.pages.flatMap((page: AllPopularRecipeApiResponse) =>
        page.recommend_recipes.map((recipe, index) =>
          PopularRecipe.create(recipe, index + 1),
        ),
      ) || []
    );
  }, [data]);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    allPopularRecipes,
    refetch,
    fetchNextPage: handleFetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}

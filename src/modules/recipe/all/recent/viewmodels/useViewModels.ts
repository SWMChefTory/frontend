import { useSuspenseInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { fetchRecentAll, RecentAllRecipesApiResponse } from "../api/api";
import { RecentRecipe } from "@/src/modules/recipe/types/Recipe";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useMemo } from "react";

export function useRecentAllViewModel(): {
  recentRecipes: RecentRecipe[];
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
} {
  const isFocused = useIsFocused();

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<
      RecentAllRecipesApiResponse,
      Error,
      InfiniteData<RecentAllRecipesApiResponse>,
      (string | boolean)[],
      number
    >({
      queryKey: ["recentRecipes", isFocused],
      queryFn: ({ pageParam = 0 }) => fetchRecentAll({ page: pageParam }),
      getNextPageParam: (lastPage) => {
        return lastPage.has_next ? lastPage.current_page + 1 : undefined;
      },
      initialPageParam: 0,
    });

  // 모든 페이지의 레시피들을 하나의 배열로 합치기
  const recentRecipes = useMemo(() => {
    return (
      data?.pages.flatMap((page: RecentAllRecipesApiResponse) =>
        page.recent_recipes.map((recipe) => RecentRecipe.create(recipe)),
      ) || []
    );
  }, [data]);

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

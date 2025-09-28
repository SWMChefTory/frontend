import {
  useSuspenseInfiniteQuery,
  InfiniteData,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchRecentAll, RecentAllRecipesApiResponse } from "../api/api";
import {
  fetchRecipeProgress,
  RecipeCreateStatusApiResponse,
} from "@/src/modules/recipe/create/step/api/api";
import { RecentRecipe, RecipeStatus } from "@/src/modules/recipe/types/Recipe";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useMemo, useRef } from "react";

export function useRecentAllViewModel(): {
  recentRecipes: RecentRecipe[];
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
} {
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();

  // 이전 inProgressRecipeIds를 추적하여 불필요한 쿼리 방지
  const prevInProgressIds = useRef<string[]>([]);

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
    });

  const recentRecipes = useMemo(() => {
    return (
      data?.pages.flatMap((page: RecentAllRecipesApiResponse) =>
        page.recent_recipes.map((recipe) => RecentRecipe.create(recipe)),
      ) || []
    );
  }, [data]);

  const inProgressRecipeIds = useMemo(() => {
    const ids = recentRecipes
      .filter((recipe) => recipe.recipeStatus === RecipeStatus.IN_PROGRESS)
      .map((recipe) => recipe.recipeId)
      .sort(); // 안정화를 위한 정렬

    // 이전과 다를 때만 업데이트
    if (JSON.stringify(ids) !== JSON.stringify(prevInProgressIds.current)) {
      prevInProgressIds.current = ids;
    }

    return prevInProgressIds.current;
  }, [recentRecipes]);

  // useQueries로 개별 쿼리 관리
  const progressQueries = useQueries({
    queries: inProgressRecipeIds.map((recipeId) => ({
      queryKey: ["recipeProgress", recipeId],
      queryFn: () => fetchRecipeProgress(recipeId),
      enabled: isFocused,
      retry: 2,
      retryDelay: 1000,
      staleTime: 2000, // 2초간 캐시 유지
      gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 방지
      // 스마트 폴링: 상태에 따라 다른 주기 적용
      refetchInterval: (data: unknown) => {
        const statusData = data as RecipeCreateStatusApiResponse;
        if (!statusData) return 3000;

        // 완료된 레시피는 폴링 중단
        if (statusData.recipe_status === RecipeStatus.SUCCESS) {
          return false;
        }

        // 실패한 레시피는 폴링 중단
        if (statusData.recipe_status === RecipeStatus.FAILED) {
          return false;
        }

        // 진행 중인 레시피만 계속 폴링
        return 3000;
      },
      refetchIntervalInBackground: true,
    })),
  });

  // useQueries 결과를 변환
  const inProgressStatusData = useMemo(() => {
    return progressQueries
      .map((query, index) => {
        if (query.isSuccess && query.data) {
          return {
            recipe_id: inProgressRecipeIds[index],
            recipe_status: query.data.recipe_status,
          };
        }
        return null;
      })
      .filter(
        (item): item is { recipe_id: string; recipe_status: RecipeStatus } =>
          item !== null,
      );
  }, [progressQueries, inProgressRecipeIds]);

  const updatedRecentRecipes = useMemo(() => {
    if (!inProgressStatusData || inProgressStatusData.length === 0) {
      return recentRecipes;
    }

    return recentRecipes
      .map((recipe) => {
        // IN_PROGRESS가 아닌 레시피는 바로 반환
        if (recipe.recipeStatus !== RecipeStatus.IN_PROGRESS) {
          return recipe;
        }

        const updatedStatus = inProgressStatusData.find(
          (status) => status.recipe_id === recipe.recipeId,
        );

        if (updatedStatus) {
          // FAILED 상태면 제거
          if (updatedStatus.recipe_status === RecipeStatus.FAILED) {
            return null;
          }

          // 상태가 변경되었을 때만 새 객체 생성
          if (updatedStatus.recipe_status !== recipe.recipeStatus) {
            return RecentRecipe.create({
              recipe_id: recipe.recipeId,
              recipe_title: recipe.title,
              video_id: recipe.youtubeId,
              video_thumbnail_url: recipe.thumbnailUrl,
              last_play_seconds: recipe.lastPlaySeconds,
              viewed_at: recipe.viewedAt.toISOString(),
              video_seconds: recipe.videoDuration,
              category: recipe.category,
              category_id: recipe.categoryId,
              recipe_status: updatedStatus.recipe_status,
            });
          }
        }

        return recipe;
      })
      .filter((recipe): recipe is RecentRecipe => recipe !== null);
  }, [recentRecipes, inProgressStatusData]);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefetch = useCallback(() => {
    // 메인 쿼리와 모든 progress 쿼리 리프레시
    refetch();

    // progress 쿼리들도 무효화
    inProgressRecipeIds.forEach((recipeId) => {
      queryClient.invalidateQueries({
        queryKey: ["recipeProgress", recipeId],
      });
    });
  }, [refetch, queryClient, inProgressRecipeIds]);

  return {
    recentRecipes: updatedRecentRecipes,
    refetch: handleRefetch,
    fetchNextPage: handleFetchNextPage,
    hasNextPage: hasNextPage,
    isFetchingNextPage,
  };
}

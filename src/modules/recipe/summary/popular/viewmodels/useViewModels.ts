import { PopularRecipe } from "@/src/modules/recipe/types/Recipe";
import {
  createPopularRecipe,
  fetchPopularSummary,
  PopularSummaryRecipeApiResponse,
  PopularSummaryRecipeResponse,
} from "@/src/modules/recipe/summary/popular/api/api";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function usePopularSummaryViewModel(): {
  popularRecipes: PopularRecipe[];
  refetch: () => Promise<any>;
} {
  const { data, refetch } = useSuspenseQuery<PopularSummaryRecipeApiResponse>({
    queryKey: ["popularSummaryRecipes"],
    queryFn: fetchPopularSummary,
  });

  const popularRecipes =
    data?.recommend_recipes.map(
      (overview: PopularSummaryRecipeResponse, index: number) =>
        PopularRecipe.create(overview, index + 1),
    ) || [];

  return {
    popularRecipes,
    refetch,
  };
}

export function useRecipeCreateViewModel() {
  const queryClient = useQueryClient();
  const { mutateAsync: create, data } = useMutation({
    mutationFn: (youtubeUrl: string) => createPopularRecipe(youtubeUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["popularSummaryRecipes"],
      });
    },
  });
  return {
    recipeId: data?.recipe_id,
    create,
  };
}

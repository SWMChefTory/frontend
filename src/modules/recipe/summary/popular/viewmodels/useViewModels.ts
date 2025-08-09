import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import {
  createPopularRecipe,
  fetchPopularSummary,
  PopularRecipeOverview,
} from "@/src/modules/recipe/summary/popular/api/api";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function usePopularSummaryViewModel(): {
  popularRecipes: PopularSummaryRecipe[];
  refetch: () => Promise<any>;
} {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["popularRecipes"],
    queryFn: fetchPopularSummary,
  });

  const popularRecipes =
    data?.recommend_recipes.map(
      (overview: PopularRecipeOverview, index: number) =>
        PopularSummaryRecipe.create(overview, index + 1),
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
        queryKey: ["recentRecipes"],
      });
    },
  });
  return {
    recipeId: data?.recipe_id,
    create,
  };
}

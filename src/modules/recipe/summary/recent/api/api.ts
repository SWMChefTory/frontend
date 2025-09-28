import { client } from "@/src/modules/shared/api/client";
import { RecipeStatus } from "@/src/modules/recipe/types/Recipe";

export interface RecentSummaryRecipeApiResponse {
  viewed_at: string;
  last_play_seconds: number;
  recipe_id: string;
  recipe_title: string;
  video_thumbnail_url: string;
  video_id: string;
  video_seconds: number;
  category: string;
  category_id: string;
  recipe_status: RecipeStatus;
}

export interface RecentSummaryRecipesApiResponse {
  recent_recipes: RecentSummaryRecipeApiResponse[];
}

export async function fetchRecentSummary(): Promise<RecentSummaryRecipesApiResponse> {
  const response =
    await client.get<RecentSummaryRecipesApiResponse>(`/recipes/recent`);
  return response.data;
}


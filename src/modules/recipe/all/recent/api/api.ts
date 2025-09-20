import { client } from "@/src/modules/shared/api/client";
import { RecipeStatus } from "@/src/modules/recipe/types/Recipe";

export interface RecentAllRecipeApiResponse {
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

export interface RecentAllRecipesApiResponse {
  current_page: number;
  has_next: boolean;
  total_elements: number;
  total_pages: number;
  recent_recipes: RecentAllRecipeApiResponse[];
}

export async function fetchRecentAll(params: {
  page: number;
}): Promise<RecentAllRecipesApiResponse> {
  const { page } = params;
  const response = await client.get<RecentAllRecipesApiResponse>(
    `/recipes/recent?page=${page}`,
  );
  return response.data;
}

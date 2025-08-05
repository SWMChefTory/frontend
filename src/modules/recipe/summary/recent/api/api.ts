import { client } from "@/src/modules/shared/api/client";

export interface RecentRecipeApiResponse {
  viewed_at: string;
  last_play_seconds: number;
  recipe_id: string;
  recipe_title: string;
  video_thumbnail_url: string;
  video_id: string;
  video_seconds: number;
  category: string;
  category_id: string;
}

export interface RecentRecipesApiResponse {
  recent_recipes: RecentRecipeApiResponse[];
}

export async function fetchRecentSummary(): Promise<RecentRecipesApiResponse> {
  const response =
    await client.get<RecentRecipesApiResponse>(`/recipes/recent`);
  return response.data;
}

import { client } from "@/src/modules/shared/api/client";

export interface PopularRecipeOverview {
  recipe_id: string;
  recipe_title: string;
  video_thumbnail_url: string;
  video_id: string;
  video_url: string;
  count: number;
}

export interface PopularRecipeApiResponse {
  recommend_recipes: PopularRecipeOverview[];
}

export async function fetchPopularSummary(): Promise<PopularRecipeApiResponse> {
  const response =
    await client.get<PopularRecipeApiResponse>(`/recipes/recommend`);
  return response.data;
}

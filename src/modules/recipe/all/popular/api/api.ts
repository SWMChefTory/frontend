import { client } from "@/src/modules/shared/api/client";

export interface AllPopularRecipeResponse {
  recipe_id: string;
  recipe_title: string;
  video_thumbnail_url: string;
  video_id: string;
  video_url: string;
  count: number;
}

export interface AllPopularRecipeApiResponse {
  current_page: number;
  has_next: boolean;
  total_elements: number;
  total_pages: number;
  recommend_recipes: AllPopularRecipeResponse[];
}

export async function fetchAllPopularSummary(params: {
  page: number;
}): Promise<AllPopularRecipeApiResponse> {
  const { page } = params;
  const response = await client.get<AllPopularRecipeApiResponse>(
    `/recipes/recommend?page=${page}`,
  );
  return response.data;
}
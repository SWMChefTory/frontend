import { client } from "@/src/modules/shared/api/client";

export interface PopularSummaryRecipeResponse {
  recipe_id: string;
  recipe_title: string;
  video_thumbnail_url: string;
  video_id: string;
  video_url: string;
  count: number;
}

export interface PopularSummaryRecipeApiResponse {
  recommend_recipes: PopularSummaryRecipeResponse[];
}

export async function fetchPopularSummary(): Promise<PopularSummaryRecipeApiResponse> {
  const response =
    await client.get<PopularSummaryRecipeApiResponse>(`/recipes/recommend`);
  return response.data;
}

export interface CreateRecipeApiResponse {
  recipe_id: string;
}

export interface CreateRecipeApiRequest {
  video_url: string;
}

export async function createPopularRecipe(
  youtubeUrl: string,
): Promise<CreateRecipeApiResponse> {
  const createRequest: CreateRecipeApiRequest = {
    video_url: youtubeUrl,
  };
  const response = await client.post<CreateRecipeApiResponse>(
    `/recipes`,
    createRequest,
  );
  return response.data;
}

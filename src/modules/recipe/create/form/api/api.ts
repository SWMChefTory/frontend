import { client } from "@/src/modules/shared/api/client";

export interface CreateRecipeApiResponse {
  recipe_id: string;
}

export interface CreateRecipeApiRequest {
  video_url: string;
}

export async function createRecipe(
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

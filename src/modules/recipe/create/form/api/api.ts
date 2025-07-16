import { axiosInstance } from "@/src/modules/shared/api/api";

export interface CreateRecipeApiResponse {
  recipeId: string;
}

export async function createRecipe(
  youtubeUrl: string,
): Promise<CreateRecipeApiResponse> {
  const response = await axiosInstance.post<CreateRecipeApiResponse>(
    `/recipes`,
    { videoUrl: youtubeUrl },
  );
  return response.data;
}

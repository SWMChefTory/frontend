import { axiosInstance } from "@/src/modules/shared/api/api";

export interface PopularRecipeVideoInfo {
  videoUri: string;
  title: string;
  thumbnailUrl: string;
  videoSeconds: number;
  videoId: string;
}

export interface PopularRecipeOverview {
  id: string;
  videoInfo: PopularRecipeVideoInfo;
  count: number;
}

export interface PopularRecipeApiResponse {
  recipeOverviews: PopularRecipeOverview[];
}

export async function fetchPopularSummary(): Promise<PopularRecipeApiResponse> {
  const response =
    await axiosInstance.get<PopularRecipeApiResponse>(`/recipes`);
  return response.data;
}

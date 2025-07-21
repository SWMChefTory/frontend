import { recentRecipesApiMock } from "@/src/modules/recipe/summary/recent/api/__mocks__/api.mock";

export interface RecentRecipeApiResponse {
  recipeId: string;
  title: string;
  youtubeId: string;
  createdAt: string;
  thumbnailUrl: string;
  progress: number;
  watchedTime: string;
}

export async function fetchRecentSummary(): Promise<RecentRecipeApiResponse[]> {
  console.log("fetchRecentSummary");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(recentRecipesApiMock));
    }, 1000);
  });
}

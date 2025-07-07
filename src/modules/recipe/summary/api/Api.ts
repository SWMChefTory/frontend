import {
  popularRecipesApiMock,
  recentRecipesApiMock,
} from "@/src/modules/recipe/summary/api/__mocks__/api.mock";

export interface PopularRecipeApiResponse {
  recipeId: string;
  title: string;
  youtubeId: string;
  count: number;
  createdAt: string;
  thumbnailUrl: string;
}

export interface RecentRecipeApiResponse {
  recipeId: string;
  title: string;
  youtubeId: string;
  createdAt: string;
  thumbnailUrl: string;
  progress: number;
  watchedTime: string;
}

export interface RecipeSummaryResponse {
  recent: RecentRecipeApiResponse[];
  popular: PopularRecipeApiResponse[];
}

export async function fetchRecipeSummary(): Promise<RecipeSummaryResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recent: Object.values(recentRecipesApiMock),
        popular: Object.values(popularRecipesApiMock),
      });
    }, 1000);
  });
}

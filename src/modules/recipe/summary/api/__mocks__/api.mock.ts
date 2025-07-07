import {
  PopularRecipeApiResponse,
  RecentRecipeApiResponse,
} from "@/src/modules/recipe/summary/api/Api";
import { PopularSummaryRecipe } from "../../popular/types/Recipe";

export const popularRecipesApiMock: Record<string, PopularRecipeApiResponse> = {
  "1": {
    recipeId: "1",
    title: "백종원의 제육볶음",
    youtubeId: "j7s9VRsrm9o",
    count: 120,
    createdAt: "2023-10-01T12:00:00Z",
    thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
  },
  "2": {
    recipeId: "2",
    title: "백종원의 제육볶음",
    youtubeId: "j7s9VRsrm9o",
    count: 120,
    createdAt: "2023-10-01T12:00:00Z",
    thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
  },
  "3": {
    recipeId: "3",
    title: "백종원의 제육볶음",
    youtubeId: "j7s9VRsrm9o",
    createdAt: "2023-10-01T12:00:00Z",
    thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    count: 50,
  },
};

export const recentRecipesApiMock: Record<string, RecentRecipeApiResponse> = {
  "1": {
    recipeId: "1",
    title: "백종원의 제육볶음",
    youtubeId: "j7s9VRsrm9o",
    createdAt: "2023-10-01T12:00:00Z",
    thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    progress: 1,
    watchedTime: "12분 30초",
  },
  "2": {
    recipeId: "2",
    title: "백종원의 제육볶음",
    youtubeId: "j7s9VRsrm9o",
    createdAt: "2023-10-01T12:00:00Z",
    thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    progress: 50,
    watchedTime: "18분 15초",
  },
  "3": {
    recipeId: "3",
    title: "백종원의 제육볶음",
    youtubeId: "j7s9VRsrm9o",
    createdAt: "2023-10-01T12:00:00Z",
    thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    progress: 50,
    watchedTime: "18분 15초",
  },
};

export const recipeSummariesMock: PopularSummaryRecipe[] = Object.values(
  popularRecipesApiMock,
).map((apiResponse) => PopularSummaryRecipe.create(apiResponse));

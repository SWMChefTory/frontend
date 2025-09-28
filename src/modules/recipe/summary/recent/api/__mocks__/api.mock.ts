import { RecentSummaryRecipeApiResponse } from "../api";
import { RecipeStatus } from "@/src/modules/recipe/types/Recipe";

export const recentRecipesApiMock: Record<
  string,
  RecentSummaryRecipeApiResponse
> = {
  "1": {
    recipe_id: "1",
    recipe_title: "백종원의 제육볶음",
    video_id: "j7s9VRsrm9o",
    video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    last_play_seconds: 1,
    viewed_at: "2023-10-01T12:00:00Z",
    video_seconds: 120,
    category: "한식",
    category_id: "1",
    recipe_status: RecipeStatus.IN_PROGRESS,
  },
  "2": {
    recipe_id: "2",
    recipe_title: "백종원의 제육볶음",
    video_id: "j7s9VRsrm9o",
    video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    last_play_seconds: 50,
    viewed_at: "2023-10-01T12:00:00Z",
    video_seconds: 120,
    category: "한식",
    category_id: "1",
    recipe_status: RecipeStatus.IN_PROGRESS,
  },
  "3": {
    recipe_id: "3",
    recipe_title: "백종원의 제육볶음",
    video_id: "j7s9VRsrm9o",
    video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    last_play_seconds: 50,
    viewed_at: "2023-10-01T12:00:00Z",
    video_seconds: 120,
    category: "한식",
    category_id: "1",
    recipe_status: RecipeStatus.IN_PROGRESS,
  },
  "4": {
    recipe_id: "4",
    recipe_title: "백종원의 제육볶음",
    video_id: "j7s9VRsrm9o",
    video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    last_play_seconds: 50,
    viewed_at: "2023-10-01T12:00:00Z",
    video_seconds: 120,
    category: "미분류",
    category_id: "1",
    recipe_status: RecipeStatus.IN_PROGRESS,
  },
  "5": {
    recipe_id: "5",
    recipe_title: "백종원의 제육볶음",
    video_id: "j7s9VRsrm9o",
    video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    last_play_seconds: 50,
    viewed_at: "2023-10-01T12:00:00Z",
    video_seconds: 120,
    category: "미분류",
    category_id: "1",
    recipe_status: RecipeStatus.IN_PROGRESS,
  },
  "6": {
    recipe_id: "6",
    recipe_title: "백종원의 제육볶음",
    video_id: "j7s9VRsrm9o",
    video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
    last_play_seconds: 50,
    viewed_at: "2023-10-01T12:00:00Z",
    video_seconds: 120,
    category: "미분류",
    category_id: "1",
    recipe_status: RecipeStatus.IN_PROGRESS,
  },
};

export function recipeSummariesMock(): RecentSummaryRecipeApiResponse[] {
  return Object.values(recentRecipesApiMock);
}

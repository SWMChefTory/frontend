import { RecentSummaryRecipeApiResponse } from "../api";

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
  },
};

export function recipeSummariesMock(): RecentSummaryRecipeApiResponse[] {
  return Object.values(recentRecipesApiMock);
}

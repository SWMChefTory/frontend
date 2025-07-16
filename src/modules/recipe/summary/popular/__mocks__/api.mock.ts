import { PopularRecipeApiResponse } from "../api/api";
import { PopularSummaryRecipe } from "../types/Recipe";

export const popularRecipesApiMock: PopularRecipeApiResponse = {
  recipeOverviews: [
    {
      id: "1",
      videoInfo: {
        videoUri: "https://youtube.com/watch?v=j7s9VRsrm9o",
        title: "백종원의 제육볶음",
        thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
        videoSeconds: 604,
        videoId: "j7s9VRsrm9o",
      },
      count: 120,
    },
    {
      id: "2",
      videoInfo: {
        videoUri: "https://youtube.com/watch?v=j7s9VRsrm9o",
        title: "백종원의 제육볶음",
        thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
        videoSeconds: 604,
        videoId: "j7s9VRsrm9o",
      },
      count: 120,
    },
    {
      id: "3",
      videoInfo: {
        videoUri: "https://youtube.com/watch?v=j7s9VRsrm9o",
        title: "백종원의 제육볶음",
        thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
        videoSeconds: 604,
        videoId: "j7s9VRsrm9o",
      },
      count: 120,
    },
    {
      id: "4",
      videoInfo: {
        videoUri: "https://youtube.com/watch?v=j7s9VRsrm9o",
        title: "백종원의 제육볶음",
        thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
        videoSeconds: 604,
        videoId: "j7s9VRsrm9o",
      },
      count: 120,
    },
    {
      id: "5",
      videoInfo: {
        videoUri: "https://youtube.com/watch?v=j7s9VRsrm9o",
        title: "백종원의 제육볶음",
        thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
        videoSeconds: 604,
        videoId: "j7s9VRsrm9o",
      },
      count: 120,
    },
  ],
};

export function recipeSummariesMock(): PopularSummaryRecipe[] {
  return popularRecipesApiMock.recipeOverviews.map((overview) => {
    return PopularSummaryRecipe.create(overview);
  });
}

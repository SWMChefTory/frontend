import { PopularRecipeApiResponse } from "../api/api";
import { PopularSummaryRecipe } from "../types/Recipe";

export const popularRecipesApiMock: PopularRecipeApiResponse = {
  recommend_recipes: [
    {
      recipe_id: "1",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
    },
    {
      recipe_id: "2",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
    },
    {
      recipe_id: "3",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
    },
    {
      recipe_id: "4",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
    },
    {
      recipe_id: "5",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
    },
    {
      recipe_id: "6",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
    },
  ],
};

export function recipeSummariesMock(): PopularSummaryRecipe[] {
  return popularRecipesApiMock.recommend_recipes.map((overview, index) => {
    return PopularSummaryRecipe.create(overview, index + 1);
  });
}

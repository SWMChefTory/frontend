import { PopularRecipe } from "@/src/modules/recipe/types/Recipe";
import { PopularSummaryRecipeApiResponse } from "@/src/modules/recipe/summary/popular/api/api";

export const popularRecipesApiMock: PopularSummaryRecipeApiResponse = {
  recommend_recipes: [
    {
      recipe_id: "1",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url:
        "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
      video_url: "https://www.youtube.com/watch?v=j7s9VRsrm9o",
    },
    {
      recipe_id: "2",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url:
        "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
      video_url: "https://www.youtube.com/watch?v=j7s9VRsrm9o",
    },
    {
      recipe_id: "3",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url:
        "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
      video_url: "https://www.youtube.com/watch?v=j7s9VRsrm9o",
    },
    {
      recipe_id: "4",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url:
        "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
      video_url: "https://www.youtube.com/watch?v=j7s9VRsrm9o",
    },
    {
      recipe_id: "5",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url:
        "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
      video_url: "https://www.youtube.com/watch?v=j7s9VRsrm9o",
    },
    {
      recipe_id: "6",
      recipe_title: "백종원의 제육볶음",
      video_id: "j7s9VRsrm9o",
      video_thumbnail_url:
        "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      count: 120,
      video_url: "https://www.youtube.com/watch?v=j7s9VRsrm9o",
    },
  ],
};

export function recipeSummariesMock(): PopularRecipe[] {
  return popularRecipesApiMock.recommend_recipes.map((overview, index) => {
    return PopularRecipe.create(overview, index + 1);
  });
}

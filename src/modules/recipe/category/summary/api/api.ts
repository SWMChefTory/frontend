import { client } from "@/src/modules/shared/api/client";

export async function deleteCategoryRecipe(recipeId: string) {
  return await client.delete(`/recipes/${recipeId}`);
}

export interface UnCategorizedRecipesApiResponse {
  unCategorized_recipes: UnCategorizedRecipeApiResponse[];
}

export interface UnCategorizedRecipeApiResponse {
  recipe_id: string;
  recipe_title: string;
  video_thumbnail_url: string;
  video_id: string;
  video_seconds: number;
  last_play_seconds: number;
  viewed_at: string;
}

export interface CategorizedRecipesApiResponse {
  categorized_recipes: CategorizedRecipeApiResponse[];
}

export interface CategorizedRecipeApiResponse {
  recipe_id: string;
  recipe_title: string;
  video_thumbnail_url: string;
  video_id: string;
  video_seconds: number;
  last_play_seconds: number;
  viewed_at: string;
  category: string;
  category_id: string;
}

export async function fetchCategorizedSummary(
  categoryId: string,
): Promise<CategorizedRecipesApiResponse> {
  const response = await client.get(`/recipes/categorized/${categoryId}`);
  return response.data;
}

export async function fetchUnCategorizedSummary(): Promise<UnCategorizedRecipesApiResponse> {
  const response = await client.get("/recipes/uncategorized");
  return response.data;
}

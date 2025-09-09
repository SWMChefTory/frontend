import { client } from "@/src/modules/shared/api/client";

export async function deleteCategoryRecipe(recipeId: string) {
  return await client.delete(`/recipes/${recipeId}`);
}

export interface UnCategorizedRecipesApiResponse {
  current_page: number;
  has_next: boolean;
  total_elements: number;
  total_pages: number;
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
  current_page: number;
  has_next: boolean;
  total_elements: number;
  total_pages: number;
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
  params: { categoryId: string; page: number }
): Promise<CategorizedRecipesApiResponse> {
  const { categoryId, page } = params;
  const response = await client.get(`/recipes/categorized/${categoryId}?page=${page}`);
  return response.data;
}

export async function fetchUnCategorizedSummary(
  params: { page: number }
): Promise<UnCategorizedRecipesApiResponse> {
  const { page } = params;
  const response = await client.get(`/recipes/uncategorized?page=${page}`);
  return response.data;
}

import { client } from "../../shared/api/client";

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

export interface CreateCategoryRequest {
  name: string;
}

export interface CategoryApiResponse {
  category_id: string;
  count: number;
  name: string;
}

export interface CategoriesApiResponse {
  categories: CategoryApiResponse[];
}

export interface UpdateCategoryRequest {
  category_id: string;
}

export async function fetchUnCategorizedSummary(): Promise<UnCategorizedRecipesApiResponse> {
  const response = await client.get("/recipes/uncategorized");
  return response.data;
}

export async function fetchCategorizedSummary(
  categoryId: string,
): Promise<CategorizedRecipesApiResponse> {
  const response = await client.get(`/recipes/categorized/${categoryId}`);
  return response.data;
}

export async function createCategory(category: string): Promise<void> {
  const request: CreateCategoryRequest = {
    name: category,
  };
  return client.post("/recipes/categories", request);
}

export async function fetchCategories(): Promise<CategoriesApiResponse> {
  const response = await client.get("/recipes/categories");
  return response.data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return await client.delete(`/recipes/categories/${categoryId}`);
}

export async function updateCategory(
  recipeId: string,
  targetCategoryId: string,
): Promise<void> {
  const request: UpdateCategoryRequest = {
    category_id: targetCategoryId,
  };
  return await client.put(`/recipes/${recipeId}/categories`, request);
}

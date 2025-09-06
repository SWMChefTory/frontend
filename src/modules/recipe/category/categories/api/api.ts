import { client } from "../../../../shared/api/client";

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

import { RecipeProgress } from "../types/Status";
import { client } from "@/src/modules/shared/api/client";
import { RecipeStatus } from "@/src/modules/recipe/types/Recipe";


export interface RecipeCreateStatusApiResponse {
  recipe_status: RecipeStatus;
  recipe_progress_statuses: RecipeProgress[];
}

export async function fetchRecipeProgress(
  recipeId: string,
): Promise<RecipeCreateStatusApiResponse> {
  const response = await client.get<RecipeCreateStatusApiResponse>(
    `/recipes/progress/${recipeId}`,
  );
  return response.data;
}

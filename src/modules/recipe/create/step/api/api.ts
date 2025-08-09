import { RecipeCreateStatus } from "../types/Status";
import { client } from "@/src/modules/shared/api/client";

export interface RecipeVideoInfo {
  video_title: string;
  video_thumbnail_url: string;
  video_seconds: number;
  video_id: string;
}

export interface RecipeIngredientsInfo {
  id: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
}

export interface RecipeStepInfo {
  step_order: number;
  subtitle: string;
  details: string[];
  start_time: number;
  end_time: number;
}

export interface RecipeCreateStatusApiResponse {
  recipe_status: RecipeCreateStatus;
  video_info: RecipeVideoInfo;
  ingredients_info: RecipeIngredientsInfo;
  recipe_steps: RecipeStepInfo[];
}

export async function fetchRecipe(
  recipeId: string,
): Promise<RecipeCreateStatusApiResponse> {
  const response = await client.get<RecipeCreateStatusApiResponse>(
    `/recipes/${recipeId}`,
  );
  return response.data;
}

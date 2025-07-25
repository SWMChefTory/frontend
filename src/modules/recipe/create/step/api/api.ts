import { RecipeCreateStatus } from "../types/Status";
import { client } from "@/src/modules/shared/api/api";

export interface RecipeVideoInfo {
  videoUri: string;
  title: string;
  thumbnailUrl: string;
  videoSeconds: number;
  videoId: string;
}

export interface RecipeIngredientsInfo {
  ingredientsId: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
}

export interface RecipeStepInfo {
  stepOrder: number;
  subtitle: string;
  details: string[];
  start: number;
  end: number;
}

export interface RecipeSubContentCreatedAt {
  captionCreatedAt: string;
  ingredientsCreatedAt: string;
  stepsCreatedAt: string;
}

export interface RecipeCreateStatusApiResponse {
  recipeStatus: RecipeCreateStatus;
  recipeSubContentCreatedAt: RecipeSubContentCreatedAt;
  videoInfo: RecipeVideoInfo;
  ingredientsInfo: RecipeIngredientsInfo;
  recipeStepInfos: RecipeStepInfo[];
}

export async function fetchRecipeCreateStatus(
  recipeId: string,
): Promise<RecipeCreateStatusApiResponse> {
  const response = await client.get<RecipeCreateStatusApiResponse>(
    `/recipes/${recipeId}`,
  );
  return response.data;
}

import { recipeCreateApiMock } from "./__mocks__/Api.mock";
import { RecipeCreateStatus } from "../types/Status";

export interface CreateRecipeApiResponse {
  recipeId: string;
}

export interface RecipeCreateStatusApiResponse {
  status: string;
}

const recipeStartTimes = new Map<string, number>();

export async function createRecipe(
  youtubeUrl: string,
): Promise<CreateRecipeApiResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const recipeId = recipeCreateApiMock;
      if (!recipeId) {
        reject(new Error("레시피 생성에 실패했습니다."));
      } else {
        resolve({ recipeId });
      }
    }, 1000);
  });
}

export async function fetchRecipeCreateStatus(
  recipeId: string,
): Promise<RecipeCreateStatusApiResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!recipeStartTimes.has(recipeId)) {
          recipeStartTimes.set(recipeId, Date.now());
        }

        const startTime = recipeStartTimes.get(recipeId)!;
        const elapsedSeconds = (Date.now() - startTime) / 1000;

        let status: RecipeCreateStatus;
        if (elapsedSeconds < 1) {
          status = RecipeCreateStatus.VIDEO_ANALYSIS;
        } else if (elapsedSeconds < 2) {
          status = RecipeCreateStatus.INGREDIENTS_ANALYSIS;
        } else if (elapsedSeconds < 3) {
          status = RecipeCreateStatus.COOKING_STEPS_ANALYSIS;
        } else if (elapsedSeconds < 4) {
          status = RecipeCreateStatus.COMPLETED;
        } else {
          recipeStartTimes.delete(recipeId);
          status = RecipeCreateStatus.VIDEO_ANALYSIS;
        }

        resolve({ status });
      } catch (error) {
        reject(new Error("레시피 생성 상태를 가져오는데 실패했습니다."));
      }
    }, 100);
  });
}

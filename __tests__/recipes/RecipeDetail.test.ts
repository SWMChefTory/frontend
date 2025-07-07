import { RecipeFlow } from "@/src/modules/recipeFlow/types/RecipeFlow";
import { recipeDetailApiMock } from "@/src/modules/recipe/detail/api/__mocks__/fetchRecipeDetail.mock";

describe("RecipeDetail 클래스를 사용 할때", () => {
  const defaultParams = {
    initialRecipeId: "success-id",
    initialTitle: "초기 제목",
    initialYoutubeId: "initial-yt-id",
  };

  describe("formatTime 메서드는", () => {
    it.each([
      [0, "준비 시간 없음"],
      [-5, "준비 시간 없음"],
      [10, "10분"],
      [60, "1시간"],
      [75, "1시간 15분"],
      [120, "2시간"],
    ])(
      '총 소요시간이 %i분일 때 "%s"을(를) 반환해야 한다',
      (input, expected) => {
        expect(RecipeFlow.formatTime(input)).toBe(expected);
      },
    );
  });

  describe("create 메서드는", () => {
    it("초기 값들을 갖는 RecipeDetail 인스턴스를 생성해야 한다", () => {
      const recipe = RecipeFlow.create(
        defaultParams.initialRecipeId,
        defaultParams.initialTitle,
        defaultParams.initialYoutubeId,
      );

      expect(recipe.recipeId).toBe(defaultParams.initialRecipeId);
      expect(recipe.title).toBe(defaultParams.initialTitle);
      expect(recipe.youtubeId).toBe(defaultParams.initialYoutubeId);
      expect(recipe.summary).toBe("");
      expect(recipe.totalTime).toBe("");
      expect(recipe.ingredients).toEqual([]);
      expect(recipe.steps).toEqual([]);
    });

    it("title과 youtubeId가 없으면 빈 문자열로 설정되어야 한다", () => {
      const recipe = RecipeFlow.create(defaultParams.initialRecipeId);

      expect(recipe.title).toBe("");
      expect(recipe.youtubeId).toBe("");
    });
  });

  describe("updateDetails 메서드는", () => {
    it("API 응답 값을 기반으로 새로운 RecipeDetail 인스턴스를 반환해야 한다", () => {
      const initial = RecipeFlow.create(
        defaultParams.initialRecipeId,
        defaultParams.initialTitle,
        defaultParams.initialYoutubeId,
      );

      const updated = initial.updateDetails(recipeDetailApiMock);

      expect(updated.recipeId).toBe(defaultParams.initialRecipeId);
      expect(updated.title).toBe(recipeDetailApiMock.title);
      expect(updated.youtubeId).toBe(recipeDetailApiMock.youtubeId);
      expect(updated.summary).toBe(recipeDetailApiMock.summary);
      expect(updated.totalTime).toBe(
        RecipeFlow.formatTime(recipeDetailApiMock.totalTime),
      );
      expect(updated.ingredients).toEqual(recipeDetailApiMock.ingredients);
      updated.steps.forEach((step, index) => {
        const apiStep = recipeDetailApiMock.steps[index];
        expect(step.stepId).toBe(apiStep.stepId);
      });
    });

    it("기존 인스턴스와는 다른 객체를 반환해야 한다", () => {
      const recipe = RecipeFlow.create(
        defaultParams.initialRecipeId,
        defaultParams.initialTitle,
        defaultParams.initialYoutubeId,
      );
      const updated = recipe.updateDetails(recipeDetailApiMock);

      expect(updated).not.toBe(recipe);
    });
  });
});

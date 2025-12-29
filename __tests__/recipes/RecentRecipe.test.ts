import { RecentRecipeApiResponse } from "@/src/modules/recipe/summary/api/Api";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/RecentRecipe";

describe("최근 시청 레시피 클래스", () => {
  describe("create 메서드는", () => {
    const apiResponse: RecentRecipeApiResponse = {
      recipeId: "r123",
      title: "계란말이",
      youtubeId: "yt12345",
      createdAt: "2024-05-01T12:00:00Z",
      thumbnailUrl: "https://img.youtube.com/vi/j7s9VRsrm9o/hqdefault.jpg",
      progress: 75,
      watchedTime: "15분 30초",
    };

    it("API 응답을 기반으로 최근 시청 레시피 인스턴스를 생성해야 한다", () => {
      const popularRecipe = RecentSummaryRecipe.create(apiResponse);

      expect(popularRecipe.recipeId).toBe(apiResponse.recipeId);
      expect(popularRecipe.title).toBe(apiResponse.title);
      expect(popularRecipe.youtubeId).toBe(apiResponse.youtubeId);
      expect(popularRecipe.watchedTime).toBe(apiResponse.watchedTime);
      expect(popularRecipe.createdAt.getTime()).toBe(
        new Date(apiResponse.createdAt).getTime(),
      );
      expect(popularRecipe.thumbnailUrl).toBe(apiResponse.thumbnailUrl);
    });

    it("createdAt이 잘못된 날짜일 경우 Invalid Date가 되어야 한다", () => {
      const invalidApiResponse = {
        ...apiResponse,
        createdAt: "invalid-date",
      };

      const popularRecipe = RecentSummaryRecipe.create(invalidApiResponse);

      expect(isNaN(popularRecipe.createdAt.getTime())).toBe(true);
    });
  });
});

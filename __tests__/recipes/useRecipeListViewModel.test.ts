import { renderHook, waitFor } from "@testing-library/react-native";
import * as api from "@/src/modules/recipe/summary/api/Api";
import {
  PopularRecipeApiResponse,
  RecentRecipeApiResponse,
  RecipeSummaryResponse,
} from "@/src/modules/recipe/summary/api/Api";
import { useRecipeSummaryViewModel } from "@/src/modules/recipe/summary/viewmodels/useViewModel";
jest.mock("@/src/modules/recipe/summary/api/recipeSummaryApi");

const popularRecipeApiResponses: PopularRecipeApiResponse[] = [
  {
    recipeId: "1",
    title: "레시피 1",
    youtubeId: "yt1",
    count: 10,
    createdAt: "2023-10-01T12:00:00Z",
    thumbnailUrl: "https://example.com/thumbnail1.jpg",
  },
  {
    recipeId: "2",
    title: "레시피 2",
    youtubeId: "yt2",
    count: 5,
    createdAt: "2023-10-02T12:00:00Z",
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
  },
];

const recentRecipeApiResponses: RecentRecipeApiResponse[] = [
  {
    recipeId: "3",
    title: "레시피 3",
    youtubeId: "yt3",
    createdAt: "2023-10-03T12:00:00Z",
    thumbnailUrl: "https://example.com/thumbnail3.jpg",
    progress: 50,
    watchedTime: "2시간 5분",
  },
];

const summary: RecipeSummaryResponse = {
  recent: recentRecipeApiResponses,
  popular: popularRecipeApiResponses,
};

describe("레시피 리스트 ViewModel을 사용할 때", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("초기 렌더링이 되면", () => {
    it("인기 게시물과 최근 시청 게시물은 빈 배열이고, loading은 true이며 error는 null이어야 한다", () => {
      const { result } = renderHook(() => useRecipeSummaryViewModel());

      const { popularRecipes, recentRecipes, loading, error } = result.current;

      expect(popularRecipes).toEqual([]);
      expect(recentRecipes).toEqual([]);
      expect(loading).toBe(true);
      expect(error).toBeNull();
    });
  });

  describe("레시피 요약 API 호출이 성공하면", () => {
    it("loading은 false가 되어야 하고, error는 null이어야 한다", async () => {
      (api.fetchRecipeSummary as jest.Mock).mockResolvedValue(summary);

      const { result } = renderHook(() => useRecipeSummaryViewModel());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const { loading, error } = result.current;

      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
    it("인기 레시피를 받아오면 레시피에 대한 정보가 채워져야 한다", async () => {
      (api.fetchRecipeSummary as jest.Mock).mockResolvedValue(summary);

      const { result } = renderHook(() => useRecipeSummaryViewModel());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const { popularRecipes } = result.current;

      expect(popularRecipes.length).toBe(popularRecipeApiResponses.length);

      popularRecipes.forEach((recipe, index) => {
        const expected = popularRecipeApiResponses[index];

        expect(recipe.recipeId).toBe(expected.recipeId);
        expect(recipe.title).toBe(expected.title);
        expect(recipe.youtubeId).toBe(expected.youtubeId);
        expect(recipe.count).toBe(expected.count);
        expect(recipe.createdAt.getTime()).toBe(
          new Date(expected.createdAt).getTime(),
        );
        expect(recipe.thumbnailUrl).toBe(expected.thumbnailUrl);
      });
    });
    it("최근 시청 레시피를 받아오면 레시피에 대한 정보가 채워져야 한다", async () => {
      (api.fetchRecipeSummary as jest.Mock).mockResolvedValue(summary);

      const { result } = renderHook(() => useRecipeSummaryViewModel());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const { recentRecipes } = result.current;

      expect(recentRecipes.length).toBe(recentRecipeApiResponses.length);

      recentRecipes.forEach((recipe, index) => {
        const expected = recentRecipeApiResponses[index];

        expect(recipe.recipeId).toBe(expected.recipeId);
        expect(recipe.title).toBe(expected.title);
        expect(recipe.youtubeId).toBe(expected.youtubeId);
        expect(recipe.createdAt.getTime()).toBe(
          new Date(expected.createdAt).getTime(),
        );
        expect(recipe.progress).toBe(expected.progress);
        expect(recipe.watchedTime).toBe(expected.watchedTime);
        expect(recipe.thumbnailUrl).toBe(expected.thumbnailUrl);
      });
    });
  });

  describe("레시피 요약 API 호출이 실패하면", () => {
    it("error 상태에 에러를 저장하고 recipes는 빈 배열이어야 한다", async () => {
      const mockError = new Error("API 실패");
      (api.fetchRecipeSummary as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useRecipeSummaryViewModel());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const { popularRecipes, recentRecipes, loading, error } = result.current;

      expect(loading).toBe(false);
      expect(error).toEqual(mockError);
      expect(popularRecipes).toEqual([]);
      expect(recentRecipes).toEqual([]);
    });
  });
});

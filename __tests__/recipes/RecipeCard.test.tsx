import { PopularRecipeSummaryCard } from "@/src/modules/recipe/summary/popular/components/Card";
import { recipeSummariesMock } from "@/src/modules/recipe/summary/popular/__mocks__/api.mock";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";

jest.mock("@/src/modules/recipe/summary/hooks/useRecipeThumbnail", () => ({
  useRecipeThumbnail: (recipe: PopularSummaryRecipe | RecentSummaryRecipe) => ({
    thumbnail: `https://mocked-thumbnail.com/${recipe.youtubeId}`,
  }),
}));
describe("RecipeCard 가 주어졌을 때", () => {
  const sampleRecipes = Object.values(recipeSummariesMock);

  describe("레시피 정보를 렌더링하는 경우", () => {
    sampleRecipes.forEach((recipe) => {
      it("썸네일 이미지를 표시해야 한다", () => {
        render(<PopularRecipeSummaryCard recipe={recipe} onPress={() => {}} />);
        const image = screen.getByTestId("recipe-image");
        expect(image.props.source.uri).toBe(
          `https://mocked-thumbnail.com/${recipe.youtubeId}`,
        );
      });

      it("제목 텍스트를 화면에 표시해야 한다", () => {
        render(<PopularRecipeSummaryCard recipe={recipe} onPress={() => {}} />);
        expect(screen.getByText(recipe.title)).toBeTruthy();
      });
    });
  });

  describe("카드를 클릭한 경우", () => {
    sampleRecipes.forEach((recipe) => {
      it(`onPress 콜백이 ${recipe.title} 레시피로 호출되어야 한다`, () => {
        const mockPress = jest.fn();
        render(
          <PopularRecipeSummaryCard recipe={recipe} onPress={mockPress} />,
        );
        fireEvent.press(screen.getByTestId(`recipe-card-${recipe.recipeId}`));
        expect(mockPress).toHaveBeenCalledWith(recipe);
      });
    });
  });
});

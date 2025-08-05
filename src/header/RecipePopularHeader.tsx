import { AllPopularRecipeTitle } from "@/src/modules/recipe/all/popular/component/Header";
import { HeaderTemplate } from "./template/HeaderTemplate";
import { router } from "expo-router";

function RecipePopularHeader() {
  return (
    <HeaderTemplate
      title={<AllPopularRecipeTitle />}
      showBackButton={true}
      onBackPress={() => router.back()}
    />
  );
}

export default RecipePopularHeader;

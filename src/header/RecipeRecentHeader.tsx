import { AllRecentRecipeTitle } from "@/src/modules/recipe/all/recent/component/Header";
import { HeaderTemplate } from "./template/HeaderTemplate";
import { router } from "expo-router";

export default function RecipeRecentHeader() {
  return (
    <HeaderTemplate
      title={<AllRecentRecipeTitle />}
      showBackButton={true}
      onBackPress={() => router.back()}
    />
  );
}

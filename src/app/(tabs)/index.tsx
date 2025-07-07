import { StyleSheet, View, ScrollView } from "react-native";
import { useRecipeSummaryViewModel } from "@/src/modules/recipe/summary/viewmodels/useViewModel";
import { useRouter } from "expo-router";
import { LoadingView } from "@/src/modules/shared/components/layout/LoadingView";
import { HomeSectionHeader } from "@/src/modules/shared/components/layout/HomeSectionHeader";
import { RecentRecipeSection } from "@/src/modules/recipe/summary/recent/components/Section";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { PopularRecipeSection } from "@/src/modules/recipe/summary/popular/components/Secition";

export default function HomeScreen() {
  const { popularRecipes, recentRecipes, loading } =
    useRecipeSummaryViewModel();
  const router = useRouter();

  const handleRecipePress = (
    recipe: PopularSummaryRecipe | RecentSummaryRecipe,
  ) => {
    if (recipe instanceof PopularSummaryRecipe) {
      router.push({
        pathname: "/recipe/create",
        params: { recipeId: recipe.recipeId },
      });
    } else if (recipe instanceof RecentSummaryRecipe) {
      router.push({
        pathname: "/recipe/detail",
        params: {
          recipeId: recipe.recipeId,
          youtubeId: recipe.youtubeId,
          title: recipe.title,
        },
      });
    }
  };

  return (
    <LoadingView loading={loading}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HomeSectionHeader
          title="맛있는 요리의 시작"
          subtitle="영상 링크로 간편하게 레시피를 만들어보세요"
        />
        <View style={styles.contentWrapper}>
          <RecentRecipeSection
            recipes={recentRecipes}
            onRecipePress={handleRecipePress}
            onViewAllPress={() => {}}
          />
          <PopularRecipeSection
            recipes={popularRecipes}
            onRecipePress={handleRecipePress}
            onViewAllPress={() => {}}
          />
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </LoadingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentWrapper: {
    padding: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});

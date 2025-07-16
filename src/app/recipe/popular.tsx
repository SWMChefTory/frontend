import { StyleSheet, View, FlatList } from "react-native";
import { usePopularSummaryViewModel } from "@/src/modules/recipe/summary/popular/viewmodels/useViewModels";
import { useRouter } from "expo-router";
import { LoadingView } from "@/src/modules/shared/components/layout/LoadingView";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { ListPageRecipeCard } from "@/src/modules/recipe/list/popular/component/ListPageRecipeCard";

export default function PopularRecipesScreen() {
  const { popularRecipes, loading } = usePopularSummaryViewModel();
  const router = useRouter();

  const handleRecipePress = (recipe: PopularSummaryRecipe) => {
    router.push({
      pathname: "/recipe/create",
      params: { recipeId: recipe.recipeId },
    });
  };

  return (
    <>
      <LoadingView loading={loading}>
        <View style={styles.container}>
          <FlatList
            data={popularRecipes}
            numColumns={2}
            keyExtractor={(item) => item.recipeId}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ListPageRecipeCard recipe={item} onPress={handleRecipePress} />
            )}
          />
        </View>
      </LoadingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

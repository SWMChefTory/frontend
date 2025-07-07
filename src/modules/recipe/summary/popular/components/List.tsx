import { FlatList, StyleSheet } from "react-native";
import { PopularRecipeSummaryCard } from "@/src/modules/recipe/summary/popular/components/Card";
import { PopularSummaryRecipe } from "../types/Recipe";

type Props = {
  recipes: PopularSummaryRecipe[];
  onPress: (recipe: PopularSummaryRecipe) => void;
};

export function PopularRecipeSummaryList({ recipes, onPress }: Props) {
  return (
    <FlatList
      data={recipes}
      numColumns={2}
      scrollEnabled={false}
      keyExtractor={(item) => item.recipeId}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <PopularRecipeSummaryCard recipe={item} onPress={onPress} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  columnWrapper: { justifyContent: "space-between" },
});

import { FlatList, StyleSheet, View } from "react-native";
import { PopularRecipeSummaryCard } from "@/src/modules/recipe/summary/popular/components/Card";
import { PopularSummaryRecipe } from "../types/Recipe";

type Props = {
  recipes: PopularSummaryRecipe[];
  onPress: (recipe: PopularSummaryRecipe) => void;
};

export function PopularRecipeSummaryList({ recipes, onPress }: Props) {

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    minHeight: 288,
  },
  columnWrapper: { 
    justifyContent: "space-between",
    paddingBottom: 8,
  },
});
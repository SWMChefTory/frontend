import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { DraxList, DraxScrollView } from "react-native-drax";
import { CategorySummaryRecipe } from "./Recipe";
import { RecipeCard } from "./Card";

interface Props {
  recipes: CategorySummaryRecipe[];
}

type RecipeListItem = CategorySummaryRecipe | { isEmpty: true; id: string };

export function CategoryRecipeSummaryList({ recipes }: Props) {
  const paddedRecipes = useMemo((): RecipeListItem[] => {
    const remainder = recipes.length % 3;
    if (remainder === 0) return recipes;

    const emptyItemsNeeded = 3 - remainder;
    const emptyItems: { isEmpty: true; id: string }[] = Array.from(
      { length: emptyItemsNeeded },
      (_, index) => ({ isEmpty: true, id: `empty-${index}` }),
    );

    return [...recipes, ...emptyItems];
  }, [recipes]);

  const renderRecipeItem = ({
    item,
    index,
  }: {
    item: RecipeListItem;
    index: number;
  }) => {
    if ("isEmpty" in item) {
      return <View style={styles.emptyItem} />;
    }

    return (
      <RecipeCard key={`recipe-${item.recipeId}`} recipe={item} index={index} />
    );
  };

  return (
    <DraxList
      data={paddedRecipes}
      style={styles.list}
      numColumns={3}
      keyExtractor={(item) => ("isEmpty" in item ? item.id : item.recipeId)}
      renderItem={({ item, index }) => renderRecipeItem({ item, index })}
      columnWrapperStyle={styles.recipeColumnWrapper}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
  recipeSection: {
    paddingHorizontal: 16,
  },
  recipeColumnWrapper: {
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyItem: {
    width: "32%",
  },
});

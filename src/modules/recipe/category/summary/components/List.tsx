import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { DraxList } from "react-native-drax";
import { CategorySummaryRecipe } from "../types/Recipe";
import { RecipeCard } from "./Card";
import {
  responsiveWidth,
  responsiveHeight,
} from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  recipes: CategorySummaryRecipe[];
  onPress?: (recipe: CategorySummaryRecipe) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

type RecipeListItem = CategorySummaryRecipe | { isEmpty: true; id: string };

export function CategoryRecipeSummaryList({
  recipes,
  onPress,
  onDragStart,
  onDragEnd,
  isDragging,
}: Props) {
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
      <RecipeCard
        key={`recipe-${item.recipeId}`}
        recipe={item}
        index={index}
        onPress={onPress!}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isDragging={isDragging}
      />
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
    paddingHorizontal: responsiveWidth(16),
  },
  recipeColumnWrapper: {
    justifyContent: "space-between",
    paddingBottom: responsiveHeight(8),
  },
  listContentContainer: {
    paddingBottom: responsiveHeight(20),
  },
  emptyItem: {
    width: "32%",
  },
});

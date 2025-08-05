import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { DraxList } from "react-native-drax";
import { CategoryCard } from "./Card";
import { AddCategoryCard } from "./modal/AddCategory";
import { Category } from "../Category";

interface Props {
  categories: Category[];
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onDropRecipe: (
    recipeId: string,
    recipeCategoryId: string | null,
    targetCategoryId: string,
  ) => void;
  onCategoryPress: (category: Category) => void;
  selectedCategoryId?: string | null;
  deletingCategoryId?: string | null;
  updatingRecipeId?: string | null;
}

export function CategoryList({
  categories,
  onAddCategory,
  onDeleteCategory,
  onDropRecipe,
  onCategoryPress,
  selectedCategoryId,
  deletingCategoryId,
  updatingRecipeId,
}: Props) {
  const categoryListData = useMemo(() => {
    const data: { type: "category" | "add"; value?: Category }[] = [];
    categories.forEach((cat) => data.push({ type: "category", value: cat }));
    data.push({ type: "add" });
    return data;
  }, [categories]);

  const renderCategoryItem = ({
    item,
    index,
  }: {
    item: { type: "category" | "add"; value?: Category };
    index: number;
  }) => {
    if (item.type === "category") {
      const category = item.value!;
      const isSelected = selectedCategoryId === category.id;
      const isDeleting = deletingCategoryId === category.id;
      const isUpdating = updatingRecipeId === category.id;
      return (
        <CategoryCard
          key={`category-${category.id}-${index}`}
          category={category}
          onDrop={onDropRecipe}
          onDelete={onDeleteCategory}
          onPress={onCategoryPress}
          isSelected={isSelected}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />
      );
    }

    if (item.type === "add") {
      return <AddCategoryCard key={`add-${index}`} onPress={onAddCategory} />;
    }

    return null;
  };

  return (
    <View style={styles.categorySection}>
      <DraxList
        data={categoryListData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `category-item-${index}`}
        renderItem={renderCategoryItem}
        ItemSeparatorComponent={() => <View style={styles.categorySeparator} />}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categorySection: {
    height: 120,
  },
  categorySeparator: {
    width: 8,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
});

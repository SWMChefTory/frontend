import React, { useMemo, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { DraxList } from "react-native-drax";
import { CategoryCard } from "./Card";
import { AddCategoryCard } from "./AddCard";
import { Category } from "../Category";
import { CategoryState, CategorySelectedState, CategoryType } from "./State";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  categories: Category[];
  onAddCategory: () => void;
  onDeleteCategory: (category: Category) => void;
  onDropRecipe: (
    recipeId: string,
    recipeCategoryId: string | null,
    targetCategoryId: string,
  ) => void;
  onCategoryPress: (category: Category) => void;
  selectedCategory: Category | null;
  deletingCategoryId: string | null; 
  updatingCategoryId: string | null;
  successCategoryId: string | null;
  isDragging: boolean;
}

export function CategoryList({
  categories,
  onAddCategory,
  onDeleteCategory,
  onDropRecipe,
  onCategoryPress,
  selectedCategory,
  deletingCategoryId,
  updatingCategoryId,
  successCategoryId,  
  isDragging,
}: Props) {
  const categoryListData = useMemo(() => {
    const data: { type: CategoryType; value?: Category }[] = categories.map(cat => ({
      type: CategoryType.CATEGORY,
      value: cat
    }));
    data.push({ type: CategoryType.ADD });
    return data;
  }, [categories]);

  // 카테고리 상태 계산
  const getCategoryState = (category: Category): CategoryState => {
    if (isDragging) return CategoryState.DRAGGING;
    if (deletingCategoryId === category.id) return CategoryState.DELETING;
    if (updatingCategoryId === category.id) return CategoryState.UPDATING;
    if (successCategoryId === category.id) return CategoryState.SUCCESS;
    return CategoryState.NORMAL;
  };

  const renderCategoryItem = useCallback(({
    item,
    index,
  }: {
    item: { type: CategoryType; value?: Category };
    index: number;
  }) => {
    if (item.type === CategoryType.CATEGORY) {
      const category = item.value!;
      const isSelected = selectedCategory?.isEquals(category);
      const categorySelectedState = isSelected 
        ? CategorySelectedState.SELECTED 
        : CategorySelectedState.UNSELECTED;
      const state = getCategoryState(category);

      return (
        <CategoryCard
          key={`category-${category.id}-${index}`}
          category={category}
          onDrop={onDropRecipe}
          onDelete={onDeleteCategory}
          onPress={onCategoryPress}
          categoryState={state}
          categorySelectedState={categorySelectedState}
        />
      );
    }

    if (item.type === CategoryType.ADD) {
      return <AddCategoryCard key={`add-${index}`} onPress={onAddCategory} />;
    }

    return null;
  }, [
    selectedCategory,
    deletingCategoryId,
    updatingCategoryId,
    isDragging,
    successCategoryId,
    onDropRecipe,
    onDeleteCategory,
    onCategoryPress,
    onAddCategory
  ]);

  const ItemSeparator = useCallback(() => (
    <View style={styles.categorySeparator} />
  ), []);

  return (
    <View style={styles.categorySection}>
      <DraxList
        data={categoryListData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `category-item-${index}`}
        renderItem={renderCategoryItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categorySection: {
    height: responsiveHeight(120),
  },
  categorySeparator: {
    width: responsiveWidth(8),
  },
  contentContainer: {
    paddingHorizontal: responsiveWidth(10),
  },
});
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { CategoryListSection } from "../categories/components/Section";
import { CategoryRecipeListSection } from "../summary/components/Section";
import { DraxProvider } from "react-native-drax";
import { Category } from "@/src/modules/recipe/category/categories/types/Category";

export function RecipeCategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const deselectCategory = () => {
    setSelectedCategory(null);
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  return (
    <DraxProvider>
      <View style={styles.container}>
        {/* 메인 컨텐츠 영역 */}
        <View style={styles.contentContainer}>
          <CategoryListSection
            onCategoryDeselect={deselectCategory}
            onCategorySelect={selectCategory}
            selectedCategory={selectedCategory}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDragging={isDragging}
          />

          {/* 레시피 목록 - 드래그 중일 때 여백 추가 */}
          <View style={styles.recipeListContainer}>
            <CategoryRecipeListSection
              selectedCategory={selectedCategory}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              isDragging={isDragging}
            />
          </View>
        </View>
      </View>
    </DraxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    flex: 1,
  },
  recipeListContainer: {
    flex: 1,
  },
  recipeListContainerWithTrash: {},
});

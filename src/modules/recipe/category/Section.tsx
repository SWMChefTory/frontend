import { useState } from "react";
import { CategoryListSection } from "./categories/Section";
import { CategoryRecipeListSection } from "./summary/Section";
import { DraxProvider } from "react-native-drax";

export function RecipeCategorySection() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const deselectCategory = () => {
    setSelectedCategoryId(null);
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <DraxProvider>
      <CategoryListSection
        onCategoryDeselect={deselectCategory}
        onCategorySelect={selectCategory}
        selectedCategoryId={selectedCategoryId}
      />
      <CategoryRecipeListSection selectedCategoryId={selectedCategoryId} />
    </DraxProvider>
  );
}

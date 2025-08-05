import { StyleSheet, View } from "react-native";
import { CategoryList } from "./List";
import { Category } from "../Category";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useCategoriesViewModel } from "./useCategoriesViewModel";
import { useDeleteCategoryViewModel } from "./useDeleteViewModel";
import { useUpdateCategoryViewModel } from "./useUpdateViewModel";
import { CategoryCreateModal } from "./modal/ModalSection";
import { useState } from "react";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { CategoriesError } from "./Fallback";
import { Suspense } from "react";
import { CategoryListSkeleton } from "./Skeleton";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";

interface Props {
  selectedCategoryId: string | null;
  onCategoryDeselect: (categoryId: string) => void;
  onCategorySelect: (categoryId: string) => void;
}

export function CategoryListSection({
  selectedCategoryId,
  onCategoryDeselect,
  onCategorySelect,
}: Props) {
  return (
    <View style={styles.categoryList}>
      <ApiErrorBoundary fallbackComponent={CategoriesError}>
        <Suspense
          fallback={
            <DeferredComponent>
              <CategoryListSkeleton />
            </DeferredComponent>
          }
        >
          <CategoryListSectionContent
            onCategoryDeselect={onCategoryDeselect}
            onCategorySelect={onCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

export function CategoryListSectionContent({
  onCategoryDeselect,
  onCategorySelect,
  selectedCategoryId,
}: Props) {
  const { categories } = useCategoriesViewModel();

  const { deleteCategory, deletingCategoryId } = useDeleteCategoryViewModel();
  const { updateCategory, updatingRecipeId } = useUpdateCategoryViewModel();

  const [openModal, setOpenModal] = useState(false);

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
    onCategoryDeselect(categoryId);
  };

  const handleAddCategory = () => {
    setOpenModal(true);
  };

  const handleCategoryPress = (category: Category) => {
    if (selectedCategoryId === category.id) {
      onCategoryDeselect(category.id);
    } else {
      onCategorySelect(category.id);
    }
  };

  const handleDropRecipe = (
    recipeId: string,
    previousCategoryId: string | null,
    targetCategoryId: string,
  ) => {
    if (previousCategoryId !== targetCategoryId) {
      updateCategory({ recipeId, previousCategoryId, targetCategoryId });
    }
  };

  return (
    <>
      <CategoryList
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onDropRecipe={handleDropRecipe}
        onCategoryPress={handleCategoryPress}
        selectedCategoryId={selectedCategoryId}
        deletingCategoryId={deletingCategoryId}
        updatingRecipeId={updatingRecipeId}
      />
      <CategoryCreateModal
        openModal={openModal}
        onCloseModal={() => setOpenModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  categoryList: {
    height: 120,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
});

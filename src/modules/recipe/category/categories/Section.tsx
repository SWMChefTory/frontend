import { StyleSheet, View } from "react-native";
import { CategoryList } from "./List";
import { Category } from "../Category";
import { useCategoriesViewModel } from "./useCategoriesViewModel";
import { useDeleteCategoryViewModel } from "./useDeleteViewModel";
import { useUpdateCategoryViewModel } from "./useUpdateViewModel";
import { CategoryCreateModal } from "./modal/ModalSection";
import { useState, Suspense } from "react";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { CategoriesError } from "./Fallback";
import { CategoryListSkeleton } from "./Skeleton";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { useRefreshOnFocus } from "@/src/modules/shared/utils/useRefreshOnFocus";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  selectedCategory: Category | null;
  onCategoryDeselect: (category: Category) => void;
  onCategorySelect: (category: Category) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function CategoryListSection({
  selectedCategory,
  onCategoryDeselect,
  onCategorySelect,
  onDragStart,
  onDragEnd,
  isDragging,
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
            selectedCategory={selectedCategory}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={isDragging}
          />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

export function CategoryListSectionContent({
  onCategoryDeselect,
  onCategorySelect,
  selectedCategory,
  onDragEnd,
  isDragging,
}: Props) {
  const { categories, refetch } = useCategoriesViewModel();
  const { deleteCategory, deletingCategoryId } = useDeleteCategoryViewModel();
  const { updateCategory, updatingCategoryId } = useUpdateCategoryViewModel();
  const [successCategoryId, setSuccessCategoryId] = useState<string | null>(null);
  
  useRefreshOnFocus(refetch);

  const [openModal, setOpenModal] = useState(false);

  const handleDeleteCategory = (category: Category) => {
    deleteCategory(category.id);
    onCategoryDeselect(category);
  };

  const handleAddCategory = () => {
    setOpenModal(true);
  };

  const handleCategoryPress = (category: Category) => {
    if (category.isEquals(selectedCategory)) {
      onCategoryDeselect(category);
    } else {
      onCategorySelect(category);
    }
  };

  const handleUpdateRecipe = (
    recipeId: string,
    previousCategoryId: string | null,
    targetCategoryId: string,
  ) => {
      updateCategory({ recipeId, previousCategoryId, targetCategoryId });
      onDragEnd();
      setSuccessCategoryId(targetCategoryId);
      setTimeout(() => {
        setSuccessCategoryId(null);
      }, 1000);
  };

  return (
    <>
      <CategoryList
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onDropRecipe={handleUpdateRecipe}
        onCategoryPress={handleCategoryPress}
        selectedCategory={selectedCategory}
        deletingCategoryId={deletingCategoryId}
        updatingCategoryId={updatingCategoryId}
        successCategoryId={successCategoryId}
        isDragging={isDragging}
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
    height: responsiveHeight(100),
    borderRadius: 24,
    marginVertical: responsiveHeight(12),
  },
});

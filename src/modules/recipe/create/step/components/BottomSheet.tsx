import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Suspense, useCallback } from "react";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { RecipeCreateFormError } from "@/src/modules/recipe/create/form/shared/Fallback";
import { RecipeCategoryBottomSheetContent } from "./BottomSheetContent";
import { CategoryListSkeleton } from "@/src/modules/recipe/category/categories/Skeleton";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";

interface Props {
  modalRef: React.RefObject<BottomSheetModal | null>;
  recipeId: string;
}

export function RecipeCategoryBottomSheet({
  modalRef,
  recipeId,
}: Props) {
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={() => modalRef.current?.dismiss()}
      />
    ),
    [modalRef],
  );

  const handleDismiss = useCallback(() => {
    modalRef.current?.dismiss();
  }, [modalRef]);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["70%"]}
      enablePanDownToClose
      enableDynamicSizing={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: COLORS.background.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      backdropComponent={renderBackdrop}
    >
      <Suspense fallback={<DeferredComponent><CategoryListSkeleton /></DeferredComponent>}> 
      <ApiErrorBoundary fallbackComponent={RecipeCreateFormError}>
        <RecipeCategoryBottomSheetContent
          recipeId={recipeId}   
          onDismiss={handleDismiss}
        />
      </ApiErrorBoundary>
      </Suspense>
    </BottomSheetModal>
  );
} 
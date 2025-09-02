import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView, BottomSheetFooter } from "@gorhom/bottom-sheet";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { RecipeCreateFormError } from "@/src/modules/recipe/create/form/shared/Fallback";
import { RecipeCategoryBottomSheetContent } from "./BottomSheetContent";
import { CategoryListSkeleton } from "@/src/modules/recipe/category/categories/Skeleton";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { StyleSheet } from "react-native";
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";
import { JSX } from "react/jsx-runtime";
import { BottomSheetCreateContent } from "./BottomSheetCreateContent";

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

  const [mode, setMode] = useState<"create" | "normal">("normal");
  const [selectedId, setSelectedId] = useState<string | null>(null);  
  const handleDismiss = useCallback(() => {
    modalRef.current?.dismiss();
  }, [modalRef]);

  const renderFooter = useCallback((props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
    <BottomSheetFooter {...props} bottomInset={0} style={{ backgroundColor: COLORS.background.orange }}>
      <BottomSheetCreateContent onDismiss={handleDismiss} recipeId={recipeId} mode={mode} changeMode={changeMode} selectedId={selectedId} />
    </BottomSheetFooter>
    ),
    [mode, selectedId]
  );

  const changeMode = useCallback((mode: "create" | "normal") => {
    setMode(mode);
  }, []);

  const changeSelectedId = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["55%"]}
      enablePanDownToClose={true}
      enableOverDrag={false}  
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
      enableDynamicSizing={false}
      footerComponent={renderFooter}
      backgroundStyle={{
        backgroundColor: COLORS.background.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      backdropComponent={renderBackdrop}
    >
      <Suspense fallback={<DeferredComponent><CategoryListSkeleton /></DeferredComponent>}> 
      <ApiErrorBoundary fallbackComponent={RecipeCreateFormError}>
          <RecipeCategoryBottomSheetContent mode={mode} changeMode={changeMode} selectedId={selectedId} changeSelectedId={changeSelectedId} />
      </ApiErrorBoundary>
      </Suspense>
    </BottomSheetModal>
  );
} 
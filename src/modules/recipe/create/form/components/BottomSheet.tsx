import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { RecipeCreateFormError } from "@/src/modules/recipe/create/form/shared/Fallback";
import { RecipeBottomSheetContent } from "./BottomSheetContent";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { useRouter } from "expo-router";

interface Props {
  modalRef: React.RefObject<BottomSheetModal | null>;
}

export function RecipeBottomSheet({ modalRef }: Props) {
  const router = useRouter();

  const handleRecipeCreated = useCallback(
    (recipeId: string) => {
      router.push({
        pathname: "/recipe/create",
        params: { recipeId },
      });
    },
    [router],
  );

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
  }, []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={1}
      snapPoints={["30%", "50%"]}
      enablePanDownToClose={true}
      backgroundStyle={{
        backgroundColor: COLORS.background.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      backdropComponent={renderBackdrop}
    >
      <ApiErrorBoundary fallbackComponent={RecipeCreateFormError}>
        <RecipeBottomSheetContent
          onRecipeCreated={handleRecipeCreated}
          onDismiss={handleDismiss}
        />
      </ApiErrorBoundary>
    </BottomSheetModal>
  );
}

import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { RecipeCreateFormError } from "@/src/modules/recipe/create/form/shared/Fallback";
import { RecipeBottomSheetContent } from "./BottomSheetContent";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { useRouter } from "expo-router";

interface Props {
  modalRef: React.RefObject<BottomSheetModal | null>;
  youtubeUrl: string;
}

export function RecipeBottomSheet({ modalRef, youtubeUrl }: Props) {
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
  }, [modalRef]);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["50%"]}
      enablePanDownToClose={true}
      enableOverDrag={false}  
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableDynamicSizing={false}
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
          youtubeUrl={youtubeUrl}
        />
        </ApiErrorBoundary>
    </BottomSheetModal>
  );
}

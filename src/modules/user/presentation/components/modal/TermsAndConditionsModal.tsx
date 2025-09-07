import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from "@gorhom/bottom-sheet";
import TermsAndConditionsModalContent from "@/src/modules/user/presentation/components/modal/content/TermsAndConditionsModalContent";
import { useCallback } from "react";
import { AgreeValue } from "./content/TermsAndConditionsModalContent";

export default function TermsAndConditionsModal({
    handleSignupPress,
    bottomSheetModalRef,
    onCancelPress,
    toBlur,
  }: {
    handleSignupPress: (agreeValue: AgreeValue) => void;
    bottomSheetModalRef: React.RefObject<BottomSheetModal|null>;
    onCancelPress: () => void;
    toBlur: () => void;
  }) {
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={onCancelPress}
              />    
        ),
        [onCancelPress]
      );
    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            backdropComponent={renderBackdrop}
            snapPoints={["45%"]}
            enableHandlePanningGesture={false}
            enableContentPanningGesture={false}
            enableDynamicSizing={false}
        >
            <TermsAndConditionsModalContent 
                handleSignupPress={handleSignupPress}
                toBlur={toBlur}
            />  
        </BottomSheetModal>
    );

}
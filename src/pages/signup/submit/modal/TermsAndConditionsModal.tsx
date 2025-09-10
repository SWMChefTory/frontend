import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from "@gorhom/bottom-sheet";
import TermsAndConditionsModalContent from "@/src/pages/signup/submit/modal/content/TermsAndConditionsModalContent";
import { useCallback } from "react";
import { AgreeValue } from "@/src/pages/signup/submit/modal/content/TermsAndConditionsModalContent";

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
            snapPoints={["50%"]}
            enableHandlePanningGesture={false}
            enableContentPanningGesture={false}
            enableDynamicSizing={false}
        >
            <TermsAndConditionsModalContent 
                handleSignupPress={(agreeValue)=>{
                    console.log("agreeValue", agreeValue);
                    handleSignupPress(agreeValue);
                }}
                toBlur={toBlur}
            />  
        </BottomSheetModal>
    );

}
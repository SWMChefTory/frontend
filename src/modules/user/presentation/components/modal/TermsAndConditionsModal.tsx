import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from "@gorhom/bottom-sheet";
import TermsAndConditionsModalContent from "@/src/modules/user/presentation/components/modal/content/TermsAndConditionsModalContent";
import { useCallback } from "react";

export default function TermsAndConditionsModal({
    handleAgreementPage,
    isServiceAgree,
    setIsServiceAgree,
    isPrivacyAgree,
    setIsPrivacyAgree,
    isMarketingAgree,
    setIsMarketingAgree,
    handleSignupPress,
    bottomSheetModalRef
  }: {
    handleAgreementPage: () => void;
    isServiceAgree: boolean;
    setIsServiceAgree: (isServiceAgree: boolean) => void;
    isPrivacyAgree: boolean;
    setIsPrivacyAgree: (isPrivacyAgree: boolean) => void;
    isMarketingAgree: boolean;
    setIsMarketingAgree: (isMarketingAgree: boolean) => void;
    handleSignupPress: () => void;
    bottomSheetModalRef: React.RefObject<BottomSheetModal|null>;
  }) {
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="none"
            appearsOnIndex={0}
            disappearsOnIndex={-1}
              />    
        ),
        []
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
                handleAgreementPage={handleAgreementPage}
                isServiceAgree={isServiceAgree}
                setIsServiceAgree={setIsServiceAgree}
                isPrivacyAgree={isPrivacyAgree}
                setIsPrivacyAgree={setIsPrivacyAgree}
                isMarketingAgree={isMarketingAgree}
                setIsMarketingAgree={setIsMarketingAgree}
                handleSignupPress={handleSignupPress}
            />
        </BottomSheetModal>
    );

}
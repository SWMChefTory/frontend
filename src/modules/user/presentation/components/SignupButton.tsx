import SquareButton from "@/src/modules/user/presentation/components/SquareButton";
import TermsAndConditionsModal from "@/src/modules/user/presentation/components/modal/TermsAndConditionsModal";
import { useEffect, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export interface AgreeValue {
  isServiceAgree: boolean;
  isPrivacyAgree: boolean;
  isMarketingAgree: boolean;
}

export default function SignupButton({
  onPress,
  onPressConfirm,
  onPressCancel,
  isFocused,
  isValid=true,
  toBlur,
  toFocus,
}: {
  onPress: () => void;
  onPressConfirm: (agreeValue: AgreeValue) => void;
  onPressCancel: () => void;
  isFocused: boolean;
  isValid: boolean;
  toBlur: () => void;
  toFocus: () => void;
}) {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    useEffect(() => {
        if (isFocused) {
          bottomSheetModalRef.current?.present();
        } else {
          bottomSheetModalRef.current?.dismiss();
        }
      }, [isFocused]);


  const handlePress = () => {
    onPress();
    toFocus();
  };
  const handleSignupPress = (agreeValue: AgreeValue) => {
    onPressConfirm(agreeValue);
    toBlur();
  };
    
  return (
    <>
      <SquareButton label="다음" onPress={handlePress} disabled={!isValid} />
      <TermsAndConditionsModal
        bottomSheetModalRef={bottomSheetModalRef}
        handleSignupPress={handleSignupPress}
        onCancelPress={onPressCancel}
        toBlur={toBlur}
      />
    </>
  );
}

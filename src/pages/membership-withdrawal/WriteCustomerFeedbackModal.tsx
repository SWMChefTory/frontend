import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import TermsAndConditionsModalContent from "@/src/pages/signup/submit/modal/content/TermsAndConditionsModalContent";
import { useCallback, useState } from "react";
import { AgreeValue } from "@/src/pages/signup/submit/modal/content/TermsAndConditionsModalContent";
import WriteCustomerFeedbackModalContent from "./WriteCustomerFeedbackModalContent";
import { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function WriteLongTextModal({
  isVisible,
  setModalVisible,
  label
}: {
  isVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  label: string;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="none"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={()=>{}}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      handleStyle={{
        display: "none"
      }}
      snapPoints={["90%"]}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <WriteCustomerFeedbackModalContent
        onClose={()=>{setModalVisible(false)}}
        onSave={()=>{setModalVisible(false)}}
        label={label}
      />
    </BottomSheetModal>
  );
}


const styles = StyleSheet.create({
  handle: {
    display: "flex",
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8
  }
});
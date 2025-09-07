import { View} from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback, useState } from "react";
import BirthOfDateModalContent from "./content/DateModalContent";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";


function DateModal({
  bottomSheetModalRef,
  onClickNextButton,
  toBlur,
}: {
  bottomSheetModalRef: React.RefObject<BottomSheetModal|null>;
  onClickNextButton: (dateOfBirth: DateOnly|null) => void;
  toBlur: () => void;
}) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={toBlur}
      />
    ),
    []
  );
  return (
    <View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        snapPoints={["50%"]}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
      >
        <BirthOfDateModalContent onClickNextButton={onClickNextButton} />
      </BottomSheetModal>
    </View>
  );
}

export default DateModal;

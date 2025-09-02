import { View} from "react-native";
import TermsAndConditions from "./TermsAndCondition";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import BirthOfDateModalContent from "./BirthOfDateModalContent";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";


function BirthOfDateModal({
  bottomSheetModalRef,
  setSelectedDateOfBirth,
  onClickNextButton,
}: {
  bottomSheetModalRef: React.RefObject<BottomSheetModal|null>;
  setSelectedDateOfBirth: (dateOfBirth: DateOnly|null) => void;
  onClickNextButton: () => void;
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
    <View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        snapPoints={["55%"]}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        //   onChange={handleSheetChanges}
      >
        <BirthOfDateModalContent onClickNextButton={onClickNextButton} setSelectedDateOfBirth={setSelectedDateOfBirth} />
      </BottomSheetModal>
    </View>
  );
}

{
  /* <BottomSheetModal
          ref={bottomSheetModalRef}
          backdropComponent={renderBackdrop}
          snapPoints={["40%"]}
          enableHandlePanningGesture={false}
          enableContentPanningGesture={false}
          enableDynamicSizing={false}
          //   onChange={handleSheetChanges}
        >
          <TermsAndConditions />
        </BottomSheetModal> */
}

export default BirthOfDateModal;

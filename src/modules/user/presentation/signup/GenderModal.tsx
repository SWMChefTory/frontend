import { View} from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import BirthOfDateModalContent from "./BirthOfDateModalContent";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import { Gender } from "../../enums/Gender";
import GenderModalContent from "./GenderModalContent";


function BirthOfDateModal({
  bottomSheetModalRef,
  setSelectedGender,
  onClickNextButton ,
}: {
  bottomSheetModalRef: React.RefObject<BottomSheetModal|null>;
  setSelectedGender: (gender: Gender|null) => void;
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
        snapPoints={["40%"]}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
      >
        <GenderModalContent onClickNextButton={onClickNextButton} setSelectedGender={setSelectedGender} />
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

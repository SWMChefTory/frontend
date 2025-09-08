import { View} from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { Gender } from "../../../enums/Gender";
import GenderModalContent from "./content/GenderModalContent";


export default function GenderModal({
  bottomSheetModalRef,
  gender,
  onClickNextButton,
  toBlur,
}: {
  bottomSheetModalRef: React.RefObject<BottomSheetModal|null>;
  gender: Gender|null;
  onClickNextButton: (gender: Gender|null) => void;
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
    [toBlur]
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
        <GenderModalContent gender={gender} onClickNextButton={onClickNextButton} />
      </BottomSheetModal>
    </View>
  );
}


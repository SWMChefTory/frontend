import { View} from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { Gender } from "@/src/modules/user/enums/Gender";
import GenderModalContent from "@/src/widgets/user/gender/modal/content/GenderModalContent";


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
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        animateOnMount={false}
      >
        <GenderModalContent gender={gender} onClickNextButton={onClickNextButton} />
      </BottomSheetModal>
    </View>
  );
}


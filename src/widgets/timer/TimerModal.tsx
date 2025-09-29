import { useCallback } from "react";
import { StyleSheet} from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import {
  responsiveWidth,
  responsiveHeight,
} from "@/src/modules/shared/utils/responsiveUI";
import Timer from "@/src/widgets/timer/components/Timer";

export type TimerModalProps = {
  recipeId: string;
  recipeTitle: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
};

/**
 *
 * @param onRequestClose 모달 닫는 요청
 * @param recipeId
 * @param recipeTitle
 * @param timerIntentType 타이머가 메세지로 시작되었울 때, 사용되는 변수
 * @param timerAutoTime 타이머가 자동으로 시작되었을 때의 시간
 * @param onNavigateToRecipe
 * @param bottomSheetModalRef
 * @returns
 */
const TimerModal = ({
  recipeId: currentRecipeId,
  recipeTitle: currentRecipeTitle,
  bottomSheetModalRef,
}: TimerModalProps) => {
  //유저가 설정한 시간(초)
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={[responsiveHeight(432)]}
      enablePanDownToClose={true}
      enableOverDrag={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animateOnMount={true}
      enableDynamicSizing={false}
      activeOffsetY={[-1, 1]}
      failOffsetX={[-5, 5]}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
    >
      <Timer
        onClose={() => {
          bottomSheetModalRef.current?.close();
        }}
        recipeId={currentRecipeId}
        recipeTitle={currentRecipeTitle}
      />
    </BottomSheetModal>
  );
};

export default TimerModal;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.primary.cook,
  },
  handleIndicator: {
    backgroundColor: COLORS.border.lightGray,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(18),
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

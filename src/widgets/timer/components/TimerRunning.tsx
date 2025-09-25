import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveFontSize, responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { useTimer } from "@/src/widgets/timer/hooks/useTimer";

type TimerRunningProps = {
  remaingMicroSec: number;
  onPause: () => void;
  onEnd: () => void;
};

export const TimerRunning = ({ remaingMicroSec, onEnd, onPause }: TimerRunningProps) => {
  const isNeared = remaingMicroSec < 1000;
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.statusText}>진행 중</Text>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onEnd}>
          <Text style={styles.btnGhostText}>중단</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={isNeared ? undefined : onPause}
        >
          <Text style={styles.btnPrimaryText}>일시정지</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: responsiveHeight(12),
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    marginTop: responsiveHeight(8),
    color: COLORS.text.gray,
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    paddingTop: responsiveHeight(16),
    gap: responsiveWidth(12),
  },
  btn: {
    flex: 1,
    paddingVertical: responsiveHeight(14),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  btnPrimary: {
    backgroundColor: COLORS.orange.main,
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  btnSecondary: {
    backgroundColor: COLORS.background.secondaryLightGray,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  btnSecondaryText: {
    color: COLORS.font.dark,
    fontWeight: "700",
  },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  btnGhostText: {
    color: COLORS.text.gray,
    fontWeight: "700",
  },
});

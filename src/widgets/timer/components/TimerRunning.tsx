import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import {
  responsiveFontSize,
  responsiveHeight,
} from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { useTimer } from "@/src/widgets/timer/hooks/useTimer";
import { Button } from "react-native-paper";
import TimerControlSection from "./TimerControlSection";

type TimerRunningProps = {
  remaingMilliSec: number;
  onPause: () => void;
  onEnd: () => void;
};

export const TimerRunning = ({
  remaingMilliSec: remaingMilliSec,
  onEnd,
  onPause,
}: TimerRunningProps) => {
  // const isNeared = remaingMilliSec < 1000;
  const buttonsProps = [
    { label: "중단", icon: "stop", color: COLORS.error.red, onPress: onEnd, isEmphasis: false, disabled: false },
    { label: "일시정지", icon: "pause", color: "white", onPress: onPause, isEmphasis: true, disabled: false },
  ];
  return (
    <View style={styles.container}>
      <TimerControlSection
        buttonsProps={buttonsProps}
        width={"92%"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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

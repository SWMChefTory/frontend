import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

type TimerRunningViewProps = {
  remainingTime: number;
  onPause: () => void;
  onEnd: () => void;
};

export function TimerRunningView({
  remainingTime,
  onPause,
  onEnd,
}: TimerRunningViewProps) {
  const isNeared = remainingTime < 1;
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.statusText}>진행 중</Text>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={isNeared ? undefined : onPause}
        >
          <Text style={styles.btnSecondaryText}>일시정지</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onEnd}>
          <Text style={styles.btnGhostText}>중단</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    marginTop: 8,
    color: COLORS.text.gray,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  btnPrimary: {
    backgroundColor: COLORS.orange.main,
  },
  btnPrimaryText: {
    color: "#000",
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

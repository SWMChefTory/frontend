import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TimerFinishedViewProps = {
  onEnd: () => void;
};

export function TimerFinishedView({ onEnd }: TimerFinishedViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.statusText}>완료</Text>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onEnd}
        >
          <Text style={styles.btnPrimaryText}>닫기</Text>
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

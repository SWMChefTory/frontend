import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

type TimerDifferentProps = {
  onGoToRecipe: () => void;
  onClose?: () => void;
};

export const TimerDifferent = ({
  onGoToRecipe,
  onClose,
}: TimerDifferentProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.statusText}>다른 레시피에서 타이머 진행 중</Text>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost]}
          onPress={onClose}
        >
          <Text style={styles.btnGhostText}>닫기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onGoToRecipe}
        >
          <Text style={styles.btnPrimaryText}>해당 레시피로 이동</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flex: 1,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  statusText: {
    marginTop: 8,
    color: COLORS.text.gray,
    fontSize: 14,
    fontWeight: "600",
  },
  titleText: {
    marginTop: 8,
    color: COLORS.font.dark,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  timeText: {
    marginTop: 6,
    color: COLORS.text.gray,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  bottomButtonContainer: {
    flexDirection: "row",
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
  btnPrimary: { backgroundColor: COLORS.orange.main },
  btnPrimaryText: { color: "#FFFFFF", fontWeight: "800", letterSpacing: -0.1 },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  btnGhostText: { color: COLORS.text.gray, fontWeight: "700" },
});

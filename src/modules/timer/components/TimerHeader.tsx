import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, Text, View } from "react-native";

type TimerHeaderProps = {
  recipeTitle?: string;
};

export function TimerHeader({ recipeTitle }: TimerHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.titleContainer}>
        <Text style={styles.modalTitle}>타이머</Text>
        {recipeTitle && <Text style={styles.activityTitle}>{recipeTitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  modalTitle: {
    color: COLORS.font.dark,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  activityTitle: {
    color: COLORS.text.gray,
    fontSize: 14,
    fontWeight: "600",
  },
});

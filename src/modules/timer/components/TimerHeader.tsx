import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import { memo } from "react";

type TimerHeaderProps = {
  recipeTitle: string;
};

export const TimerHeader = memo(({ recipeTitle }: TimerHeaderProps) => {
  return (
    <View style={styles.headerRow}>
      <View style={styles.titleContainer}>
        <Text style={styles.modalTitle}>타이머</Text>
        <Text
          style={styles.activityTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {recipeTitle || " "}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
    paddingTop: 16,
  },
  modalTitle: {
    color: COLORS.font.dark,
    fontSize: 22,
    fontWeight: "800",
  },
  activityTitle: {
    paddingTop: 10,
    color: COLORS.text.gray,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    minHeight: 40,
  },
});

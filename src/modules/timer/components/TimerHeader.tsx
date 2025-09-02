import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import { memo } from "react";
import { responsiveFontSize } from "../../shared/utils/responsiveUI";
import { responsiveWidth } from "../../shared/utils/responsiveUI";
import { responsiveHeight } from "../../shared/utils/responsiveUI";

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
    paddingRight: responsiveWidth(12),
  },
  modalTitle: {
    color: COLORS.font.dark,
    fontSize: responsiveFontSize(22),
    fontWeight: "800",
  },
  activityTitle: {
    paddingTop: responsiveHeight(10),
    color: COLORS.text.gray,
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
    lineHeight: responsiveHeight(20),
    minHeight: responsiveHeight(40),
  },
});

import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  progress: number;
  colors: readonly [string, string];
  scaleValue: Animated.Value;
}

export function ProgressSection({ progress, colors, scaleValue }: Props) {
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>진행률</Text>
        <Text style={styles.progressValue}>{progress.toFixed(2)}%</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={colors}
            style={[styles.progressBar, { width: `${progress}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Animated.View
              style={[
                styles.progressShine,
                { transform: [{ scaleX: scaleValue }] },
              ]}
            />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    width: "100%",
    margin: responsiveWidth(32),
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(12),
  },
  progressLabel: {
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
    color: COLORS.text.gray,
  },
  progressValue: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    color: COLORS.text.black,
    minWidth: responsiveWidth(60),
    textAlign: "right",
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBarBg: {
    width: "100%",
    height: responsiveHeight(16),
    backgroundColor: COLORS.background.lightGray,
    borderRadius: responsiveWidth(8),
    overflow: "hidden",
    shadowColor: COLORS.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBar: {
    height: "100%",
    borderRadius: responsiveWidth(8),
    position: "relative",
  },
  progressShine: {
    position: "absolute",
    right: 0,
    top: 0,
    width: responsiveWidth(8),
    height: "100%",
    backgroundColor: COLORS.background.lightGray,
  },
});

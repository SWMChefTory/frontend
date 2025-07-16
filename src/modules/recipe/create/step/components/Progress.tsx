import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/src/modules/shared/constants/colors";

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
        <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
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
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.gray,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBarBg: {
    width: "100%",
    height: 16,
    backgroundColor: COLORS.background.lightGray,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: COLORS.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBar: {
    height: "100%",
    borderRadius: 8,
    position: "relative",
  },
  progressShine: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 8,
    height: "100%",
    backgroundColor: COLORS.background.lightGray,
  },
});

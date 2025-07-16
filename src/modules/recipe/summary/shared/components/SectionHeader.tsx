import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

export function RecipeSectionHeader({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.modernCardHeader}>
      <View style={styles.titleWithAccent}>
        <View style={styles.orangeAccentBar} />
        <Text style={styles.modernSectionTitle}>{title}</Text>
      </View>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.modernViewAllText}>전체 보기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modernCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleWithAccent: {
    flexDirection: "row",
    alignItems: "center",
  },
  orangeAccentBar: {
    width: 5,
    height: 26,
    backgroundColor: COLORS.background.orange,
    borderRadius: 3,
    marginRight: 14,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  modernSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text.black,
    letterSpacing: -0.5,
  },
  modernViewAllText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.orange.main,
    textDecorationLine: "underline",
    textDecorationColor: COLORS.orange.main,
  },
});

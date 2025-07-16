import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  title: string;
  subtitle: string;
}

export function RecipeFormHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.headerSection}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>✨</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: COLORS.background.orange,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  iconText: {
    fontSize: 24,
    color: COLORS.text.white,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text.gray,
    lineHeight: 22,
  },
});

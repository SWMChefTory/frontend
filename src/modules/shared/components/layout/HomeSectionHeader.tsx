import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export function HomeSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.headerSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: "transparent",
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontFamily: 'NotoSerifKR_700Bold',
    fontSize: 32,
    fontWeight: "800",
    color: "#2F2F2F",
    marginBottom: 8,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: 'NotoSerifKR_400Regular',
    fontSize: 16,
    color: "#2F2F2F",
    lineHeight: 24,
  },
});
import { COLORS } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export function HomeSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <LinearGradient
      colors={[COLORS.priamry.main, COLORS.background.white]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0.5 }}
      style={styles.headerSection}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.createButton}>
        <TouchableOpacity style={styles.createTachable}>
          <Text style={styles.createText}>전체 보기</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: 32,
    fontWeight: "800",
    color: "#2F2F2F",
    marginBottom: 8,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: 16,
    color: "#2F2F2F",
    lineHeight: 24,
  },
  createButton: {
    backgroundColor: COLORS.background.white,
    borderRadius: 10,
    paddingTop: 10,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  createTachable: {
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: 12,
    color: COLORS.font.dark,
  },
});

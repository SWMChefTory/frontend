import { View, StyleSheet, Text } from "react-native";
import { FontAwesome5 as Icon } from "@expo/vector-icons";

export function HomeHeader() {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.titleGradient}>쉐프토리</Text>
      <Icon name="utensils" size={20} color="#FF6B3D" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleGradient: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF6B3D",
    marginRight: 8,
  },
});

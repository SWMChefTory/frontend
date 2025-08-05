import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function NotificationHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16, // ✅ 내부 여백으로 처리 (외부 여백은 부모가 결정하도록)
  },
  iconButton: {
    padding: 8, // ✅ 터치 영역 확대
    borderRadius: 20,
  },
});

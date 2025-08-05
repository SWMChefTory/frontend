import { Ionicons } from "@expo/vector-icons";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function UserInfoItemTemplate({
    title, 
    value, 
    action,
  }: {
    title: string, 
    value: string,
    action: () => void,
  }) {
    return (
      <TouchableOpacity onPress={action} style={styles.modalTextContainer}>
        <Text style={styles.modalTextLeft}>{title}</Text>
        <Text style={styles.modalTextRight}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color="grey" />
      </TouchableOpacity>
    );
  }
const styles = StyleSheet.create({
    modalTextContainer:{
      flexDirection: 'row',     // 🔹 좌우 배치
      justifyContent: 'space-between', // 간격 조정 (기타: 'center', 'flex-start', 'flex-end')
      alignItems: 'center',     // 세로 정렬
      marginBottom: 30,
    },
    modalTextLeft: {
      flex: 1,
      fontSize: 15,
    },
    modalTextRight: {
      flex: 2,
      marginRight:4,
      textAlign: 'right',
      fontSize: 15,
    },
});
import { useInteractionBlocker } from "@/src/modules/shared/blocker/store/interactionBlocker";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "react-native";

export default function ScreenBlocker() {
  const { blocked, message } = useInteractionBlocker();
  console.log("blocked", message);
  console.log("blocked", blocked);
  if (!blocked) return null;

  return (
    <View
      style={styles.overlay}
      pointerEvents="auto"                                 
      importantForAccessibility="no-hide-descendants"     
      accessible={false}
    >
      {/* <ActivityIndicator size="large" /> */}
      {/* {!!message && <Text style={styles.msg}>{message}</Text>} */}
    </View>
  );
}


const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
      backgroundColor: "rgba(0,0,0,0.12)", // 필요시 완전 투명도 가능
      justifyContent: "center",
      alignItems: "center",
    },
    msg: { marginTop: 12, fontSize: 16 },
  });
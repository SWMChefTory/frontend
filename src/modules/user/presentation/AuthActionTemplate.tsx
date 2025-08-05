import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AuthActionTemplate({
  authAction,
  actionName,
}: {
  authAction: () => void;
  actionName: string;
}) {
  return (
    <TouchableOpacity style={styles.userAccessTouchable} onPress={authAction}>
      <Text style={styles.userAccessText}>{actionName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userAccessTouchable: {
    alignItems: "center",
  },
  userAccessText: {
    color: "grey",
  },
});

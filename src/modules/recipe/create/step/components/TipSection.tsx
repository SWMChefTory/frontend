import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  tipText: string;
}

export function TipSection({ tipText }: Props) {
  return (
    <View style={styles.tipContainer}>
      <Text style={styles.tipText}>{tipText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tipContainer: {
    alignItems: "center",
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text.gray,
    fontStyle: "italic",
    fontWeight: "500",
    textAlign: "center",
  },
});

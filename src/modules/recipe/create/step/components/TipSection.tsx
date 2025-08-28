import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  tipText: string;
}

export function TipSection({ tipText }: Props) {
  return (
    <View style={styles.tipContainer}>
      <Text 
        style={styles.tipText}
        numberOfLines={0}
        lineBreakStrategyIOS="hangul-word"
        textBreakStrategy="simple"
      >
        {tipText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tipContainer: {
    alignItems: "center",
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text.gray,
    fontStyle: "italic",
    fontWeight: "500",
    textAlign: "center",
  },
});

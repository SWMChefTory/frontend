import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";

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
    padding: responsiveWidth(16),
  },
  tipText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.text.gray,
    fontStyle: "italic",
    fontWeight: "500",
    textAlign: "center",
  },
});

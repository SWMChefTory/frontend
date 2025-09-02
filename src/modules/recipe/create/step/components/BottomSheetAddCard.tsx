import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  onPress: () => void;
}

export function BottomSheetAddCard({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconContainer}>
        <Ionicons name="add" size={22} color={COLORS.text.white} />
      </View>
      <Text style={styles.text}>카테고리 추가</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveHeight(92),
    borderRadius: 12,
    backgroundColor: COLORS.orange.main,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: responsiveWidth(32),
    height: responsiveHeight(32),
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(6),
  },
  text: {
    color: COLORS.text.white,
    fontSize: responsiveFontSize(12),
    fontWeight: "700",
  },
});

export default BottomSheetAddCard;


import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";

export function RecipeSectionHeader({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.modernCardHeader}>
      <View style={styles.titleWithAccent}>
        <View style={styles.orangeAccentBar} />
        <Text style={styles.modernSectionTitle}>{title}</Text>
      </View>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="resize-sharp" size={25} color={COLORS.orange.main} />
          {/* <Text style={styles.modernViewAllText}>전체 보기</Text> */}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modernCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(20),
    paddingHorizontal: responsiveWidth(16),
  },
  titleWithAccent: {
    flexDirection: "row",
    alignItems: "center",
  },
  orangeAccentBar: {
    width: responsiveWidth(5),
    height: responsiveHeight(26),
    backgroundColor: COLORS.orange.main,
    borderRadius: responsiveWidth(3),
    marginRight: responsiveWidth(14),
  },
  modernSectionTitle: {
    fontSize: responsiveFontSize(20),
    fontFamily: "NotoSerifKR_400Regular",
    fontWeight: "700",
    color: COLORS.font.dark,
    letterSpacing: -0.5,
  },
  modernViewAllText: {
    fontSize: responsiveFontSize(15),
    fontWeight: "700",
    color: COLORS.orange.main,
    textDecorationLine: "underline",
    textDecorationColor: COLORS.orange.main,
  },
});

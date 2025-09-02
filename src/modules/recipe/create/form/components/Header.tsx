import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

interface Props {
  title: string;
  subtitle: string;
}

export function RecipeFormHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.headerSection}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>✨</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(15),
  },
  iconContainer: {
    width: responsiveWidth(64),
    height: responsiveHeight(64),
    borderRadius: 24,
    backgroundColor: COLORS.background.orange,
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(20),
    ...SHADOW,
  },
  iconText: {
    fontSize: responsiveFontSize(24),
    color: COLORS.text.white,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(22),
    fontWeight: "bold",
    color: COLORS.text.black,
    marginBottom: responsiveHeight(4),
  },
  subtitle: {
    fontSize: responsiveFontSize(15),
    color: COLORS.text.gray,
    lineHeight: responsiveHeight(22),
  },
});

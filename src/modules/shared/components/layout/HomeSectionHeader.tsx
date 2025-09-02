import { COLORS } from "../../constants/colors";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SHADOW } from "../../constants/shadow";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";

export function HomeSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.headerSection}> 
      <Image source={require("@/assets/images/mainCharacter.png")} style={styles.logo} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: COLORS.background.white,
    paddingTop: responsiveHeight(14),
    paddingBottom: responsiveHeight(14),
    paddingHorizontal: responsiveWidth(12),
    ...SHADOW,
    flexDirection: "row",
  },
  logo: {
    width: responsiveWidth(60),
    height: responsiveHeight(60), 
    marginLeft: responsiveWidth(10),
    marginRight: responsiveWidth(20),
  },
  textContainer: {
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: responsiveFontSize(20),
    fontWeight: "800",
    color: COLORS.font.dark,
    lineHeight: responsiveHeight(40),
  },
  subtitle: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: responsiveFontSize(12),
    color: COLORS.font.dark,
    lineHeight: responsiveHeight(24),
  },
  createButton: {
    backgroundColor: COLORS.background.white,
    borderRadius: 10,
    paddingTop: responsiveHeight(10),
    width: responsiveWidth(70),
    alignItems: "center",
    justifyContent: "center",
  },
  createTachable: {
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: responsiveFontSize(12),
    color: COLORS.font.dark,
  },
});

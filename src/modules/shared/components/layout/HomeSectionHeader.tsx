import { COLORS } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export function HomeSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    // <LinearGradient
    //   colors={[COLORS.priamry.main, COLORS.background.white]}
    //   start={{ x: 0.5, y: 1 }}
    //   end={{ x: 0.5, y: 0.5 }}
    //   style={styles.headerSection}
    // >
    //   <Text style={styles.title}>{title}</Text>
    //   <Text style={styles.subtitle}>{subtitle}</Text>
    //   <View style={styles.createButton}>
    //     <TouchableOpacity style={styles.createTachable}>
    //       <Text style={styles.createText}>전체 보기</Text>
    //     </TouchableOpacity>
    //   </View>
    // </LinearGradient>
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
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 12,
    // borderBottomLeftRadius: 28,
    // borderBottomRightRadius: 28,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 14,
    shadowColor: COLORS.font.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
    flexDirection: "row",
  },
  logo: {
    width: 60,
    height: 60, 
    marginLeft: 10,
    marginRight: 20,
  },
  textContainer: {
    // flexDirection: "co",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: 20,
    fontWeight: "800",
    color: "#2F2F2F",
    // marginBottom: 2,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: 12,
    color: "#2F2F2F",
    lineHeight: 24,
  },
  createButton: {
    backgroundColor: COLORS.background.white,
    borderRadius: 10,
    paddingTop: 10,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  createTachable: {
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    fontFamily: "DoHyeon_400Regular",
    fontSize: 12,
    color: COLORS.font.dark,
  },
});

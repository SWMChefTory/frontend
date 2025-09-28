import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ImageSource } from "expo-image";
import { responsiveHeight } from "../../../shared/utils/responsiveUI";
import { responsiveWidth } from "../../../shared/utils/responsiveUI";
import { responsiveFontSize } from "../../../shared/utils/responsiveUI";
import { COLORS } from "../../../shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
  

function LoginButtonTemplate({ description,logoPath,logoSize, handleSignIn }: {description: string, logoPath:ImageSource, logoSize:{width:number, height:number}, handleSignIn: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Image source={logoPath} style={{ height: logoSize.height, aspectRatio: 1, resizeMode: "contain" }} />
          </View>
          <Text style={styles.buttonText}>{description}</Text>
        </View>
      </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
    button: {
      width: responsiveWidth(250),
      height: responsiveHeight(50),
      backgroundColor: COLORS.background.white,
      borderRadius: responsiveWidth(8),
      ...SHADOW,
      justifyContent: 'center',
    },
    buttonContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveWidth(16),
    },
    iconContainer: {
      marginRight: responsiveWidth(16),
    },
    buttonText: {
      fontSize: responsiveFontSize(16),
      fontWeight: '700',
      color: COLORS.text.gray,
      fontFamily: 'NotoSerifKR_400Regular',
    },
  });

export default LoginButtonTemplate; 
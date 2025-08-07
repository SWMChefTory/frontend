import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ImageSource } from "expo-image";


function LoginButtonTemplate({ description,logoPath,logoSize, handleSignIn }: {description: string, logoPath:ImageSource, logoSize:{width:number, height:number}, handleSignIn: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Image source={logoPath} style={{ width: logoSize.width, height: logoSize.height }} />
          </View>
          <Text style={styles.buttonText}>{description}</Text>
        </View>
      </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
    button: {
      width: 200,
      height: 50,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#DADCE0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
      // marginBottom: 16,
      justifyContent: 'center',
    },
    buttonContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    iconContainer: {
      marginRight: 16,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#3C4043',
      fontFamily: 'NotoSerifKR_400Regular',
    },
  });

export default LoginButtonTemplate; 
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

export const NextButton = ({handleSignupPress: handleSignupPress, isLoading}: {handleSignupPress: () => void, isLoading: boolean}) => {
  return (
    <View style={styles.nextButtonContainer}>
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={handleSignupPress}
        disabled={isLoading}
      >
        <Text style={styles.nextButtonText}>
          {isLoading ? "처리중..." : "다음"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    nextButton: {
        backgroundColor: COLORS.orange.main,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.shadow.orange,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        width: 240,
      },
      nextButtonText: {
        color: COLORS.text.white,
        fontSize: 12,
        fontWeight: '600',
      },
    
      nextButtonContainer:{
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
      },  
})
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

export const NextButton = ({
  handleSignupPress: handleSignupPress,
  buttonText,
  isLoading=false,
  isEnabled=true,
}: {
  handleSignupPress: () => void;
  buttonText: string;
  isLoading: boolean;
  isEnabled: boolean;
}) => {
  return (
    <View style={styles.nextButtonContainer}>
      <TouchableOpacity
        style={[styles.nextButton,(isLoading || !isEnabled) && styles.nextButtonDisabled]}
        onPress={handleSignupPress}
        disabled={isLoading || !isEnabled}
      >
        <Text style={styles.nextButtonText}>
          {isLoading ? "처리중..." : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: COLORS.orange.main,
    justifyContent: "center",
    borderRadius: 12,
    alignItems: "center",
    // marginTop: 20,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    alignSelf: "stretch",
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.orange.inactive,
  },
  nextButtonText: {
    color: COLORS.text.white,
    fontSize: 12,
    fontWeight: "600",
  },

  nextButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    alignSelf: "stretch",
  },
});

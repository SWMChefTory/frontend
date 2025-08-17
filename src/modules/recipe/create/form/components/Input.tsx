import { View, Text, StyleSheet, TextInput } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

interface RecipeFormInputProps {
  videoUrl: string;
  urlError: string;
  isLoading: boolean;
  onUrlChange: (text: string) => void;
  label: string;
  placeholder: string;
}

export function RecipeFormInput({
  videoUrl,
  urlError,
  isLoading,
  onUrlChange,
  label,
  placeholder,
}: RecipeFormInputProps) {
  return (
    <View style={styles.inputCard}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          urlError ? styles.inputContainerError : null,
        ]}
      >
        <BottomSheetTextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.gray}
          value={videoUrl}
          onChangeText={onUrlChange}
          editable={!isLoading}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, !urlError && styles.errorTextHidden]}>
          {urlError || " "}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    backgroundColor: COLORS.background.secondaryLightGray,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.shadow.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.gray,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: COLORS.border.lightGray,
  },
  inputContainerError: {
    borderColor: COLORS.error.red,
    borderWidth: 2,
  },
  textInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: COLORS.text.black,
    backgroundColor: "transparent",
  },
  errorText: {
    color: COLORS.error.red,
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
  errorTextHidden: {
    opacity: 0,
  },
  errorContainer: {
    height: 20,
  },
});

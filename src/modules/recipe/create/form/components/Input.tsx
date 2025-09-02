import { View, Text, StyleSheet, TextInput } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

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
    padding: responsiveWidth(20),
    marginBottom: responsiveHeight(12),
    ...SHADOW,
  },
  inputLabel: {
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    color: COLORS.text.gray,
    marginBottom: responsiveHeight(12),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(4),
    borderWidth: 2,
    borderColor: COLORS.border.lightGray,
  },
  inputContainerError: {
    borderColor: COLORS.error.red,
    borderWidth: 2,
  },
  textInput: {
    flex: 1,
    height: responsiveHeight(56),
    fontSize: responsiveFontSize(16),
    color: COLORS.text.black,
    backgroundColor: "transparent",
  },
  errorText: {
    color: COLORS.error.red,
    fontSize: responsiveFontSize(12),
    marginTop: responsiveHeight(8),
    fontWeight: "500",
  },
  errorTextHidden: {
    opacity: 0,
  },
  errorContainer: {
    height: responsiveHeight(20),
  },
});

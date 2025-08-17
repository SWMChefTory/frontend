import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

interface RecipeFormButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
  createButtonLabel: string;
  progressButtonLabel: string;
}

export function RecipeFormButton({
  isLoading,
  isDisabled,
  onSubmit,
  createButtonLabel,
  progressButtonLabel,
}: RecipeFormButtonProps) {
  return (
    <TouchableOpacity
      style={styles.createButtonWrapper}
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={onSubmit}
    >
      <View
        style={[styles.createButton, isDisabled && styles.createButtonDisabled]}
      >
        <Text style={styles.createButtonText}>
          {isLoading ? progressButtonLabel : createButtonLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createButtonWrapper: {
    marginTop: 8,
  },
  createButton: {
    backgroundColor: COLORS.background.orange,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW
  },
  createButtonDisabled: {
    backgroundColor: COLORS.background.lightGray,
    borderColor: COLORS.border.lightGray,
    shadowColor: COLORS.shadow.black,
    shadowOpacity: 0.05,
  },
  createButtonText: {
    color: COLORS.text.white,
    fontSize: 17,
    fontWeight: "700",
  },
});

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

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
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: COLORS.border.orange,
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

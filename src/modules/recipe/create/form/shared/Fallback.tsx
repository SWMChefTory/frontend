import { View, Text, TouchableOpacity } from "react-native";
import { errorStyles } from "@/src/modules/shared/styles/error";

interface RecipeCreateFormErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function RecipeCreateFormError({
  error,
  resetErrorBoundary,
}: RecipeCreateFormErrorProps) {
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.title}>문제가 발생했습니다</Text>
      <Text style={errorStyles.message}>올바른 유튜브 링크를 입력해주세요</Text>
      <TouchableOpacity
        style={errorStyles.retryButton}
        onPress={resetErrorBoundary}
      >
        <Text style={errorStyles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}

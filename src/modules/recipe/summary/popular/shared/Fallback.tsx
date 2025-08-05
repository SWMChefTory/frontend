import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { errorStyles } from "@/src/modules/shared/styles/error";
import { useQueryClient } from "@tanstack/react-query";

interface PopularRecipeErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function PopularRecipeError({
  error,
  resetErrorBoundary,
}: PopularRecipeErrorProps) {
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.title}>추천 레시피를 불러올 수 없습니다</Text>
      <Text style={errorStyles.message}>네트워크 연결을 확인해주세요</Text>
      <TouchableOpacity
        style={errorStyles.retryButton}
        onPress={resetErrorBoundary}
      >
        <Text style={errorStyles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}

export default PopularRecipeError;

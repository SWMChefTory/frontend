import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { errorStyles } from "@/src/modules/shared/styles/error";

interface AllPopularRecipeErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function AllPopularRecipeError({
  error,
  resetErrorBoundary,
}: AllPopularRecipeErrorProps) {
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.title}>추천 레시피 목록을 불러올 수 없습니다</Text>
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

export default AllPopularRecipeError;

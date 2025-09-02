import { View, Text, TouchableOpacity } from "react-native";
import { errorStyles } from "@/src/modules/shared/styles/error";

interface RecentRecipeErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function RecentRecipeError({
  error,
  resetErrorBoundary,
}: RecentRecipeErrorProps) {
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.title}>최근 레시피를 불러올 수 없습니다</Text>
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

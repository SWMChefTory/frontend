import { View, Text, TouchableOpacity } from "react-native";
import { errorStyles } from "@/src/modules/shared/styles/error";

interface GlobalErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function GlobalError({ error, resetErrorBoundary }: GlobalErrorProps) {
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.title}>오류가 발생했습니다</Text>
      <Text style={errorStyles.message}>나중에 다시 시도해주세요</Text>
      <TouchableOpacity
        style={errorStyles.retryButton}
        onPress={resetErrorBoundary}
      >
        <Text style={errorStyles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}

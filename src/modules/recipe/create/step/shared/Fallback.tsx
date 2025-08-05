import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { errorStyles } from "@/src/modules/shared/styles/error";

interface RecipeCreateStepErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function RecipeCreateStepError({
  error,
  resetErrorBoundary,
}: RecipeCreateStepErrorProps) {
  const router = useRouter();

  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.title}>문제가 발생했습니다</Text>
      <Text style={errorStyles.message}>다시 시도해주세요</Text>

      <View style={errorStyles.buttonContainer}>
        <TouchableOpacity
          style={errorStyles.retryButton}
          onPress={resetErrorBoundary}
        >
          <Text style={errorStyles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={errorStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={errorStyles.backButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

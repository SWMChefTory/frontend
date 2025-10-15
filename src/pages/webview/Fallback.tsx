import { View, Text, TouchableOpacity } from "react-native";
import { errorStyles } from "@/src/modules/shared/styles/error";
import { router } from "expo-router";

interface RecipeWebViewFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function RecipeWebViewFallback({
    error,
    resetErrorBoundary,
  }: RecipeWebViewFallbackProps) {
    return (
      <View style={errorStyles.container}>
        <Text style={errorStyles.title}>레시피를 불러올 수 없습니다</Text>
        <Text style={errorStyles.message}>네트워크 연결을 확인해주세요</Text>
        <TouchableOpacity
          style={errorStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={errorStyles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  export default RecipeWebViewFallback;
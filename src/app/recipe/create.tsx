import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { RecipeStepContent } from "@/src/modules/recipe/create/step/components/Content";
import { RecipeCreateStepError } from "@/src/modules/recipe/create/step/shared/Fallback";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";

export default function RecipeCreateScreen() {
  const { recipeId } = useLocalSearchParams<{
    recipeId: string;
  }>();

  const router = useRouter();

  const handleCompleted = () => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: "/recipe/detail",
        params: { recipeId: recipeId },
      });

      return () => clearTimeout(timer);
    }, 500);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ApiErrorBoundary fallbackComponent={RecipeCreateStepError}>
        <RecipeStepContent recipeId={recipeId} onCompleted={handleCompleted} />
      </ApiErrorBoundary>
    </>
  );
}

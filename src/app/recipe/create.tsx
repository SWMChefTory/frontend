import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRecipeCreateAnimation } from "@/src/modules/recipe/create/hooks/useAnimation";
import {
  RECIPE_CREATE_STEPS,
  STEP_ORDER,
  TIP_TEXT,
} from "@/src/modules/recipe/create/constants/Steps";
import { LoadingAnimation } from "@/src/modules/recipe/create/components/LoadingAnimation";
import { ProgressSection } from "@/src/modules/recipe/create/components/ProgressSection";
import { StepInfoCard } from "@/src/modules/recipe/create/components/StepInfoCard";
import { TipSection } from "@/src/modules/recipe/create/components/TipSection";
import { useRecipeCreateStatusViewModel } from "@/src/modules/recipe/create/viewmodel/useStatusViewModel";

export default function RecipeCreateScreen() {
  const { recipeId } = useLocalSearchParams<{
    recipeId: string;
  }>();

  const router = useRouter();
  const { status, error } = useRecipeCreateStatusViewModel(recipeId);
  const { spin, reverseSpin, bounce, scaleValue } = useRecipeCreateAnimation();

  const currentStepIndex = STEP_ORDER.indexOf(status);
  const progress = ((currentStepIndex + 1) / STEP_ORDER.length) * 100;
  const currentStepData = RECIPE_CREATE_STEPS[status];

  useEffect(() => {
    if (status === "COMPLETED") {
      const timer = setTimeout(() => {
        router.replace({
          pathname: "/recipe/detail",
          params: { recipeId: recipeId },
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [status, recipeId, router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={currentStepData.bgColors}
        style={styles.container}
      >
        <View style={styles.content}>
          <LoadingAnimation
            icon={currentStepData.icon}
            colors={currentStepData.colors}
            spin={spin}
            reverseSpin={reverseSpin}
            bounce={bounce}
            scaleValue={scaleValue}
          />

          <ProgressSection
            progress={progress}
            colors={currentStepData.colors}
            scaleValue={scaleValue}
          />

          <StepInfoCard
            title={currentStepData.title}
            description={currentStepData.description}
            stepOrder={STEP_ORDER}
            currentStepIndex={currentStepIndex}
            scaleValue={scaleValue}
          />

          <TipSection tipText={TIP_TEXT} />
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  content: {
    maxWidth: 320,
    paddingHorizontal: 24,
    alignItems: "center",
  },
});

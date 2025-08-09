import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LoadingAnimation } from "./LoadingAnimation";
import { ProgressSection } from "./Progress";
import { StepInfoCard } from "./Card";
import { TipSection } from "./TipSection";
import { STEP_ORDER, TIP_TEXT, RECIPE_CREATE_STEPS } from "../constants/Steps";
import { useRecipeCreateStatusViewModel } from "../viewmodel/useStatusViewModel";
import { useRecipeCreateAnimation } from "../hooks/useAnimation";
import { RecipeCreateStatus } from "../types/Status";
import { useEffect } from "react";

interface Props {
  recipeId: string;
  onCompleted?: () => void;
}

export function RecipeStepContent({ recipeId, onCompleted }: Props) {
  const { status, progress } = useRecipeCreateStatusViewModel(recipeId);
  const { spin, reverseSpin, bounce, scaleValue } = useRecipeCreateAnimation();

  const currentStepIndex = STEP_ORDER.indexOf(status);
  const currentStepData = RECIPE_CREATE_STEPS[status];

  useEffect(() => {
    if (status === RecipeCreateStatus.COMPLETED) {
      onCompleted?.();
    }
  }, [status, onCompleted]);

  return (
    <LinearGradient colors={currentStepData.bgColors} style={styles.container}>
      <View style={styles.content}>
        <LoadingAnimation
          image={currentStepData.image}
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

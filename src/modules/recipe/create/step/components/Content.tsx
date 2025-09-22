import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LoadingAnimation } from "./LoadingAnimation";
import { ProgressSection } from "./Progress";
import { StepInfoCard } from "./Card";
import { TipSection } from "./TipSection";
import { DetailSteps } from "./DetailSteps";
import { STEP_ORDER, TIP_TEXT, RECIPE_CREATE_STEPS } from "../constants/Steps";
import { useRecipeCreateStatusViewModel } from "../viewmodel/useStatusViewModel";
import { useRecipeCreateAnimation } from "../hooks/useAnimation";
import { RecipeCreateStatus } from "../types/Status";
import { useEffect } from "react";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  recipeId: string;
  onCompleted?: () => void;
}

export function RecipeStepContent({ recipeId, onCompleted }: Props) {
  const { status, progress, progresses } =
    useRecipeCreateStatusViewModel(recipeId);
  const { spin, reverseSpin, bounce, scaleValue } = useRecipeCreateAnimation();

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
        {/*<StepInfoCard title={} description={} stepOrder={} currentStepIndex={} scaleValue={}*/}

        <DetailSteps progresses={progresses} scaleValue={scaleValue} />

        <TipSection tipText={TIP_TEXT} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: responsiveWidth(100),
    alignItems: "center",
    zIndex: 50,
  },
  content: {
    paddingHorizontal: responsiveWidth(24),
    alignItems: "center",
  },
});

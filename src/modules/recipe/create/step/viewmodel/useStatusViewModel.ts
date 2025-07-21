import { useState, useEffect, useRef } from "react";
import { fetchRecipeCreateStatus } from "../api/api";
import { RecipeCreateStatus } from "../types/Status";
import { useQuery } from "@tanstack/react-query";
import { STEP_ORDER } from "../constants/Steps";

const MIN_STAGE_DURATION = 500;

export function useRecipeCreateStatusViewModel(recipeId: string) {
  const [currentUIStatus, setCurrentUIStatus] = useState<RecipeCreateStatus>(
    RecipeCreateStatus.VIDEO_ANALYSIS,
  );
  const [actualStatus, setActualStatus] = useState<RecipeCreateStatus>(
    RecipeCreateStatus.VIDEO_ANALYSIS,
  );
  const stageStartTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<number | null>(null);

  const { data } = useQuery({
    queryKey: ["recipeCreateStatus", recipeId],
    queryFn: () => fetchRecipeCreateStatus(recipeId),
    refetchInterval:
      actualStatus === RecipeCreateStatus.COMPLETED ? false : 1000,
    enabled: !!recipeId,
  });

  useEffect(() => {
    const createdAt = data?.recipeSubContentCreatedAt;
    if (!createdAt) {
      setActualStatus(RecipeCreateStatus.VIDEO_ANALYSIS);
      return;
    }

    const { captionCreatedAt, ingredientsCreatedAt, stepsCreatedAt } =
      createdAt;

    if (stepsCreatedAt) {
      setActualStatus(RecipeCreateStatus.COMPLETED);
    } else if (ingredientsCreatedAt) {
      setActualStatus(RecipeCreateStatus.COOKING_STEPS_ANALYSIS);
    } else if (captionCreatedAt) {
      setActualStatus(RecipeCreateStatus.INGREDIENTS_ANALYSIS);
    } else {
      setActualStatus(RecipeCreateStatus.VIDEO_ANALYSIS);
    }
  }, [data]);

  useEffect(() => {
    const currentIndex = STEP_ORDER.indexOf(currentUIStatus);
    const actualIndex = STEP_ORDER.indexOf(actualStatus);

    if (actualIndex <= currentIndex) return;

    const elapsedTime = Date.now() - stageStartTimeRef.current;
    const remainingTime = Math.max(0, MIN_STAGE_DURATION - elapsedTime);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentUIStatus(STEP_ORDER[currentIndex + 1]);
      stageStartTimeRef.current = Date.now();
    }, remainingTime);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [actualStatus, currentUIStatus]);

  return {
    status: currentUIStatus,
  };
}

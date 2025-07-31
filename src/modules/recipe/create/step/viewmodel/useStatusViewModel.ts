import { useState, useEffect } from "react";
import { fetchRecipeCreateStatus } from "../api/api";
import { RecipeCreateStatus } from "../types/Status";
import { useQuery } from "@tanstack/react-query";
import { STEP_ORDER } from "../constants/Steps";

const MIN_STAGE_DURATION = 500;

const STEP_PROGRESS_RANGES = {
  [RecipeCreateStatus.VIDEO_ANALYSIS]: { start: 0, end: 25 },
  [RecipeCreateStatus.INGREDIENTS_ANALYSIS]: { start: 25, end: 50 },
  [RecipeCreateStatus.COOKING_STEPS_ANALYSIS]: { start: 50, end: 75 },
  [RecipeCreateStatus.COMPLETED]: { start: 75, end: 100 },
};

export function useRecipeCreateStatusViewModel(recipeId: string) {
  const [currentUIStatus, setCurrentUIStatus] = useState<RecipeCreateStatus>(
    RecipeCreateStatus.VIDEO_ANALYSIS
  );
  const [progress, setProgress] = useState<number>(0);
  const [stageStartTime, setStageStartTime] = useState<number>(Date.now());

  const { data } = useQuery({
    queryKey: ["recipeCreateStatus", recipeId],
    queryFn: () => fetchRecipeCreateStatus(recipeId),
    refetchInterval: currentUIStatus === RecipeCreateStatus.COMPLETED ? false : 1000,
    enabled: !!recipeId,
  });

  const getActualStatus = (): RecipeCreateStatus => {
    if (!data?.video_info) return RecipeCreateStatus.VIDEO_ANALYSIS;
    if (data.recipe_steps?.length > 0) return RecipeCreateStatus.COMPLETED;
    if (data.ingredients_info) return RecipeCreateStatus.COOKING_STEPS_ANALYSIS;
    return RecipeCreateStatus.INGREDIENTS_ANALYSIS;
  };

  useEffect(() => {
    if (!data) return;

    const actualStatus = getActualStatus();
    const currentIndex = STEP_ORDER.indexOf(currentUIStatus);
    const actualIndex = STEP_ORDER.indexOf(actualStatus);

    if (actualIndex <= currentIndex) return;

    const elapsedTime = Date.now() - stageStartTime;
    const remainingTime = Math.max(0, MIN_STAGE_DURATION - elapsedTime);

    const timer = setTimeout(() => {
      const nextStatus = STEP_ORDER[currentIndex + 1];
      setCurrentUIStatus(nextStatus);
      setStageStartTime(Date.now());
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [data, currentUIStatus, stageStartTime]);

  useEffect(() => {
    const actualStatus = getActualStatus();
    const currentRange = STEP_PROGRESS_RANGES[currentUIStatus];
    if (!currentRange) return;

    const actualIndex = STEP_ORDER.indexOf(actualStatus);
    const currentIndex = STEP_ORDER.indexOf(currentUIStatus);
    const isStepCompleted = actualIndex > currentIndex;
    const isCompleted = currentUIStatus === RecipeCreateStatus.COMPLETED;

    let targetProgress;
    if (isCompleted) {
      targetProgress = 100;
    } else if (isStepCompleted) {
      targetProgress = currentRange.end;
    } else {
      targetProgress = currentRange.start + (currentRange.end - currentRange.start) * 0.7;
    }

    const animate = () => {
      setProgress(current => {
        const diff = targetProgress - current;
        const distance = Math.abs(diff);
        
        if (isCompleted && distance < 1) return targetProgress;
        if (!isCompleted && distance < 0.1) return targetProgress;
        
        let speed;
        if (isCompleted) {
          if (distance < 5) speed = 0.4;
          else if (distance < 15) speed = 0.6;
          else speed = 0.8;
        } else if (isStepCompleted) {
          if (distance < 2) speed = 0.15;
          else if (distance < 5) speed = 0.25;
          else speed = 0.35;
        } else {
          if (distance < 2) speed = 0.008;
          else if (distance < 5) speed = 0.015;
          else if (distance < 10) speed = 0.025;
          else speed = 0.04;
        }
        
        return current + diff * speed;
      });
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [currentUIStatus, data]);

  useEffect(() => {
    if (progress === 0) {
      const initialRange = STEP_PROGRESS_RANGES[RecipeCreateStatus.VIDEO_ANALYSIS];
      const initialTarget = initialRange.start + (initialRange.end - initialRange.start) * 0.2;
      setProgress(initialTarget);
    }
  }, [progress]);

  return {
    status: currentUIStatus,
    progress: Math.round(progress * 10) / 10,
  };
}
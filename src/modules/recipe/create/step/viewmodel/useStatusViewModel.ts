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
    RecipeCreateStatus.VIDEO_ANALYSIS,
  );
  const [progress, setProgress] = useState<number>(0);
  const [stageStartTime, setStageStartTime] = useState<number>(Date.now());

  const { data } = useQuery({
    queryKey: ["recipeCreateStatus", recipeId],
    queryFn: () => fetchRecipeCreateStatus(recipeId),
    refetchInterval:
      currentUIStatus === RecipeCreateStatus.COMPLETED ? false : 1000,
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

    if (data.recipe_status.toLowerCase() === "failed") {
      throw new Error("Recipe creation failed");
    }

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
      targetProgress =
        currentRange.start + (currentRange.end - currentRange.start);
    }

    const animate = () => {
      setProgress((current) => {
        const diff = targetProgress - current;
        const distance = Math.abs(diff);

        // 목표에 거의 도달했을 때 정확한 값으로 설정
        if (isCompleted && distance < 0.5) return targetProgress;
        if (!isCompleted && distance < 0.05) return targetProgress;

        let speed;

        if (isCompleted) {
          // 완료 단계: 빠르게 100%로
          if (distance < 2) speed = 0.15;
          else if (distance < 5) speed = 0.25;
          else if (distance < 10) speed = 0.35;
          else speed = 0.45;
        } else if (isStepCompleted) {
          // 단계가 완료되어 end로 이동: 중간 속도
          if (distance < 1)
            speed = 0.03; // end 근처에서 매우 천천히
          else if (distance < 3) speed = 0.06;
          else if (distance < 8) speed = 0.12;
          else speed = 0.18;
        } else {
          // 단계 진행 중: 매우 천천히
          const rangeSize = currentRange.end - currentRange.start;
          const progressInRange = current - currentRange.start;
          const progressRatio = progressInRange / rangeSize;

          // 각 단계의 end에 가까워질수록 더 천천히
          let baseSpeed;
          if (progressRatio > 0.9)
            baseSpeed = 0.002; // 90% 이후 매우 느리게
          else if (progressRatio > 0.8)
            baseSpeed = 0.003; // 80% 이후 느리게
          else if (progressRatio > 0.6)
            baseSpeed = 0.005; // 60% 이후 조금 느리게
          else baseSpeed = 0.008; // 처음엔 조금 빠르게

          // 거리에 따른 속도 조절
          if (distance < 1) speed = baseSpeed * 0.3;
          else if (distance < 3) speed = baseSpeed * 0.6;
          else if (distance < 8) speed = baseSpeed * 1.0;
          else speed = baseSpeed * 1.5;
        }

        return current + diff * speed;
      });
    };

    const interval = setInterval(animate, 16); // 60fps로 부드럽게
    return () => clearInterval(interval);
  }, [currentUIStatus, data]);

  useEffect(() => {
    if (progress === 0) {
      const initialRange =
        STEP_PROGRESS_RANGES[RecipeCreateStatus.VIDEO_ANALYSIS];
      const initialTarget =
        initialRange.start + (initialRange.end - initialRange.start) * 0.1;
      setProgress(initialTarget);
    }
  }, [progress]);

  return {
    status: currentUIStatus,
    progress: Math.round(progress * 100) / 100,
  };
}

import { useEffect, useState } from "react";
import { fetchRecipeProgress } from "../api/api";
import {
  RecipeCreateStatus,
  RecipeProgress,
  RecipeProgressDetail,
  RecipeProgressStep,
} from "../types/Status";
import { useQuery } from "@tanstack/react-query";
import {
  DETAIL_PROGRESS_WEIGHTS,
  PROGRESS_TO_STATUS_MAP,
  STAGE_DETAILS,
  STATUS_PROGRESS_RANGES,
  STEP_ORDER,
} from "../constants/Steps";
import { RecipeStatus } from "@/src/modules/recipe/types/Recipe";

const MIN_STAGE_DURATION = 500;

export function useRecipeCreateStatusViewModel(recipeId: string) {
  const [currentUIStatus, setCurrentUIStatus] = useState<RecipeCreateStatus>(
    RecipeCreateStatus.VIDEO_ANALYSIS,
  );
  const [progress, setProgress] = useState<number>(0);
  const [stageStartTime, setStageStartTime] = useState<number>(Date.now());

  const { data } = useQuery({
    queryKey: ["recipeProgress", recipeId],
    queryFn: () => fetchRecipeProgress(recipeId),
    refetchInterval:
      currentUIStatus === RecipeCreateStatus.COMPLETED ? false : 1000,
    enabled: !!recipeId,
  });

  const getStatusFromProgresses = (
    progresses: RecipeProgress[],
  ): RecipeCreateStatus => {
    if (!progresses || progresses.length === 0) {
      return RecipeCreateStatus.VIDEO_ANALYSIS;
    }
    const last = progresses[progresses.length - 1];
    return (
      PROGRESS_TO_STATUS_MAP[last.progress_step as RecipeProgressStep] ||
      RecipeCreateStatus.VIDEO_ANALYSIS
    );
  };

  const calculateDetailedProgress = (
    progresses: RecipeProgress[],
    uiStatus: RecipeCreateStatus,
  ): number => {
    if (!progresses || progresses.length === 0) return 0;

    const range = STATUS_PROGRESS_RANGES[uiStatus];
    const last = progresses[progresses.length - 1];

    const detailsInStage = STAGE_DETAILS[uiStatus] ?? [];
    const weights = detailsInStage
      .map((d) => DETAIL_PROGRESS_WEIGHTS[d])
      .filter((w): w is number => true);

    if (weights.length === 0) return range.start;

    const w =
      DETAIL_PROGRESS_WEIGHTS[last.progress_detail as RecipeProgressDetail] || 0;
    return range.start + (range.end - range.start) * w;
  };

  useEffect(() => {
    if (!data) return;

    if (data.recipe_status === RecipeStatus.FAILED) {
      throw new Error("Recipe creation failed");
    }

    const actualStatus = getStatusFromProgresses(data.recipe_progress_statuses);
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
    if (!data?.recipe_progress_statuses) return;

    const actualStatus = getStatusFromProgresses(data.recipe_progress_statuses);
    const currentRange = STATUS_PROGRESS_RANGES[currentUIStatus];
    if (!currentRange) return;

    const actualIndex = STEP_ORDER.indexOf(actualStatus);
    const currentIndex = STEP_ORDER.indexOf(currentUIStatus);
    const isStepCompleted = actualIndex > currentIndex;
    const isCompleted = currentUIStatus === RecipeCreateStatus.COMPLETED;

    let targetProgress: number;

    if (isCompleted) {
      targetProgress = 100;
    } else if (isStepCompleted) {
      targetProgress = currentRange.end;
    } else {
      const detailed = calculateDetailedProgress(
        data.recipe_progress_statuses,
        currentUIStatus,
      );
      const minProgress =
        currentRange.start + (currentRange.end - currentRange.start) * 0.3;
      targetProgress = Math.max(detailed, minProgress);
    }

    const animate = () => {
      setProgress((current) => {
        const diff = targetProgress - current;
        const distance = Math.abs(diff);

        if (isCompleted && distance < 0.5) return targetProgress;
        if (!isCompleted && distance < 0.05) return targetProgress;

        let speed: number;

        if (isCompleted) {
          if (distance < 2) speed = 0.15;
          else if (distance < 5) speed = 0.25;
          else if (distance < 10) speed = 0.35;
          else speed = 0.45;
        } else if (isStepCompleted) {
          if (distance < 1) speed = 0.03;
          else if (distance < 3) speed = 0.06;
          else if (distance < 8) speed = 0.12;
          else speed = 0.18;
        } else {
          const rangeSize = currentRange.end - currentRange.start;
          const progressInRange = current - currentRange.start;
          const progressRatio = rangeSize > 0 ? progressInRange / rangeSize : 0;

          let baseSpeed: number;
          if (progressRatio > 0.8) baseSpeed = 0.002;
          else if (progressRatio > 0.6) baseSpeed = 0.004;
          else if (progressRatio > 0.4) baseSpeed = 0.006;
          else baseSpeed = 0.008;

          if (distance < 1) speed = Math.max(baseSpeed * 0.3, 0.001);
          else if (distance < 3) speed = Math.max(baseSpeed * 0.6, 0.002);
          else if (distance < 8) speed = Math.max(baseSpeed * 1.0, 0.003);
          else speed = Math.max(baseSpeed * 1.5, 0.005);

          if (diff < 0) speed *= 2; // 역행 시 빠르게 복귀
        }

        return current + diff * speed;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [currentUIStatus, data]);

  useEffect(() => {
    if (progress === 0) {
      const initialRange =
        STATUS_PROGRESS_RANGES[RecipeCreateStatus.VIDEO_ANALYSIS];
      const initialTarget =
        initialRange.start + (initialRange.end - initialRange.start) * 0.1;
      setProgress(initialTarget);
    }
  }, [progress]);

  return {
    status: currentUIStatus,
    progress: Math.round(progress * 100) / 100,
    progresses: data?.recipe_progress_statuses || [],
  };
}

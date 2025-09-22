export enum RecipeCreateStatus {
  VIDEO_ANALYSIS = "VIDEO_ANALYSIS",
  INGREDIENTS_ANALYSIS = "INGREDIENTS_ANALYSIS",
  COOKING_STEPS_ANALYSIS = "COOKING_STEPS_ANALYSIS",
  COMPLETED = "COMPLETED",
}

export interface RecipeProgress {
  progress_step:
    | "READY"
    | "CAPTION"
    | "DETAIL"
    | "BRIEFING"
    | "STEP"
    | "FINISHED";
  progress_detail:
    | "READY"
    | "CAPTION"
    | "INGREDIENT"
    | "TAG"
    | "DETAIL_META"
    | "BRIEFING"
    | "STEP"
    | "FINISHED";
}

export enum RecipeProgressStep {
  READY = "READY",
  CAPTION = "CAPTION",
  DETAIL = "DETAIL",
  BRIEFING = "BRIEFING",
  STEP = "STEP",
  FINISHED = "FINISHED",
}

export enum RecipeProgressDetail {
  READY = "READY",
  CAPTION = "CAPTION",
  INGREDIENT = "INGREDIENT",
  TAG = "TAG",
  DETAIL_META = "DETAIL_META",
  BRIEFING = "BRIEFING",
  STEP = "STEP",
  FINISHED = "FINISHED",
}

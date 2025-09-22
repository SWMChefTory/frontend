import {
  RecipeCreateStatus,
  RecipeProgressDetail,
  RecipeProgressStep
} from "@/src/modules/recipe/create/step/types/Status";

export const RECIPE_CREATE_STEPS = {
  [RecipeCreateStatus.VIDEO_ANALYSIS]: {
    image: require("@/assets/images/video-analysis.png"),
    title: "영상 분석 중",
    description: "AI가 영상 내용을 꼼꼼히 분석하고 있어요",
    colors: ["#3B82F6", "#8B5CF6"] as const,
    bgColors: ["#EFF6FF", "#F3E8FF"] as const,
  },
  [RecipeCreateStatus.INGREDIENTS_ANALYSIS]: {
    image: require("@/assets/images/ingredients.png"),
    title: "재료 파악 중",
    description: "사용된 재료들을 하나씩 확인하고 있어요",
    colors: ["#10B981", "#059669"] as const,
    bgColors: ["#ECFDF5", "#D1FAE5"] as const,
  },
  [RecipeCreateStatus.COOKING_STEPS_ANALYSIS]: {
    image: require("@/assets/images/cooking-steps.png"),
    title: "조리법 정리 중",
    description: "요리 과정을 단계별로 정리하고 있어요",
    colors: ["#F97316", "#DC2626"] as const,
    bgColors: ["#FFF7ED", "#FEF2F2"] as const,
  },
  [RecipeCreateStatus.COMPLETED]: {
    image: require("@/assets/images/recipe-complete.png"),
    title: "레시피 완성!",
    description: "마지막 검토와 함께 레시피를 완성했어요",
    colors: ["#A855F7", "#EC4899"] as const,
    bgColors: ["#FAF5FF", "#FDF2F8"] as const,
  },
};

export const STEP_ORDER = [
  RecipeCreateStatus.VIDEO_ANALYSIS,
  RecipeCreateStatus.INGREDIENTS_ANALYSIS,
  RecipeCreateStatus.COOKING_STEPS_ANALYSIS,
  RecipeCreateStatus.COMPLETED,
];

export const STAGE_DETAILS: Record<RecipeCreateStatus, RecipeProgressDetail[]> =
  {
    [RecipeCreateStatus.VIDEO_ANALYSIS]: [
      RecipeProgressDetail.READY,
      RecipeProgressDetail.CAPTION,
    ],
    [RecipeCreateStatus.INGREDIENTS_ANALYSIS]: [
      RecipeProgressDetail.INGREDIENT,
      RecipeProgressDetail.TAG,
      RecipeProgressDetail.DETAIL_META,
      RecipeProgressDetail.BRIEFING,
    ],
    [RecipeCreateStatus.COOKING_STEPS_ANALYSIS]: [RecipeProgressDetail.STEP],
    [RecipeCreateStatus.COMPLETED]: [RecipeProgressDetail.FINISHED],
  };

// Step → Status 매핑 (유지)
export const PROGRESS_TO_STATUS_MAP: Record<
  RecipeProgressStep,
  RecipeCreateStatus
> = {
  [RecipeProgressStep.READY]: RecipeCreateStatus.VIDEO_ANALYSIS,
  [RecipeProgressStep.CAPTION]: RecipeCreateStatus.VIDEO_ANALYSIS,
  [RecipeProgressStep.DETAIL]: RecipeCreateStatus.INGREDIENTS_ANALYSIS,
  [RecipeProgressStep.STEP]: RecipeCreateStatus.COOKING_STEPS_ANALYSIS,
  [RecipeProgressStep.FINISHED]: RecipeCreateStatus.COMPLETED,
  [RecipeProgressStep.BRIEFING]: RecipeCreateStatus.INGREDIENTS_ANALYSIS,
};

// Status별 진행 구간 (단계 비중 조절)
export const STATUS_PROGRESS_RANGES: Record<
  RecipeCreateStatus,
  { start: number; end: number }
> = {
  [RecipeCreateStatus.VIDEO_ANALYSIS]: { start: 0, end: 50 },
  [RecipeCreateStatus.INGREDIENTS_ANALYSIS]: { start: 50, end: 75 },
  [RecipeCreateStatus.COOKING_STEPS_ANALYSIS]: { start: 75, end: 90 },
  [RecipeCreateStatus.COMPLETED]: { start: 90, end: 100 },
};

export const DETAIL_PROGRESS_WEIGHTS: Record<RecipeProgressDetail, number> = {
  [RecipeProgressDetail.READY]: 0.5,
  [RecipeProgressDetail.CAPTION]: 1.0,
  [RecipeProgressDetail.INGREDIENT]: 0.3,
  [RecipeProgressDetail.TAG]: 0.3,
  [RecipeProgressDetail.DETAIL_META]: 0.5,
  [RecipeProgressDetail.BRIEFING]: 1.0,
  [RecipeProgressDetail.STEP]: 0.8,
  [RecipeProgressDetail.FINISHED]: 1.0,
};
export const DETAIL_STEPS_INFO = {
  [RecipeProgressDetail.READY]: {
    label: "준비 중",
    description: "레시피 생성을 준비하고 있어요",
  },
  [RecipeProgressDetail.CAPTION]: {
    label: "영상 분석",
    description: "영상 내용을 꼼꼼히 분석하고 있어요",
  },
  [RecipeProgressDetail.INGREDIENT]: {
    label: "재료 정리",
    description: "필요한 재료들을 정리하고 있어요",
  },
  [RecipeProgressDetail.TAG]: {
    label: "정보 분류",
    description: "요리 정보를 분류하고 있어요",
  },
  [RecipeProgressDetail.DETAIL_META]: {
    label: "내용 정리",
    description: "레시피 내용을 정리하고 있어요",
  },
  [RecipeProgressDetail.BRIEFING]: {
    label: "요약 작성",
    description: "레시피 요약을 작성하고 있어요",
  },
  [RecipeProgressDetail.STEP]: {
    label: "단계 구성",
    description: "요리 단계를 구성하고 있어요",
  },
  [RecipeProgressDetail.FINISHED]: {
    label: "완성",
    description: "레시피가 완성되었어요",
  },
};
// 각 상태별로 보여줄 세부 단계들
export const STATUS_DETAIL_STEPS = {
  [RecipeCreateStatus.VIDEO_ANALYSIS]: [
    RecipeProgressDetail.READY,
    RecipeProgressDetail.CAPTION,
  ],
  [RecipeCreateStatus.INGREDIENTS_ANALYSIS]: [
    RecipeProgressDetail.INGREDIENT,
    RecipeProgressDetail.TAG,
    RecipeProgressDetail.DETAIL_META,
    RecipeProgressDetail.BRIEFING,
  ],
  [RecipeCreateStatus.COOKING_STEPS_ANALYSIS]: [RecipeProgressDetail.STEP],
  [RecipeCreateStatus.COMPLETED]: [RecipeProgressDetail.FINISHED],
};

export const TIP_TEXT = "💡 AI가 영상 속 숨겨진 요리 비법까지 찾아내고 있어요!";

import { RecipeCreateStatus } from "@/src/modules/recipe/create/step/types/Status";

export const RECIPE_CREATE_STEPS = {
  [RecipeCreateStatus.VIDEO_ANALYSIS]: {
    icon: "🎬",
    title: "영상 분석 중",
    description: "AI가 영상 내용을 꼼꼼히 분석하고 있어요",
    colors: ["#3B82F6", "#8B5CF6"] as const,
    bgColors: ["#EFF6FF", "#F3E8FF"] as const,
  },
  [RecipeCreateStatus.INGREDIENTS_ANALYSIS]: {
    icon: "🥕",
    title: "재료 파악 중",
    description: "사용된 재료들을 하나씩 확인하고 있어요",
    colors: ["#10B981", "#059669"] as const,
    bgColors: ["#ECFDF5", "#D1FAE5"] as const,
  },
  [RecipeCreateStatus.COOKING_STEPS_ANALYSIS]: {
    icon: "👨‍🍳",
    title: "조리법 정리 중",
    description: "요리 과정을 단계별로 정리하고 있어요",
    colors: ["#F97316", "#DC2626"] as const,
    bgColors: ["#FFF7ED", "#FEF2F2"] as const,
  },
  [RecipeCreateStatus.COMPLETED]: {
    icon: "📝",
    title: "레시피 완성 중",
    description: "마지막 검토와 함께 레시피를 완성하고 있어요",
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

export const TIP_TEXT = "💡 AI가 영상 속 숨겨진 요리 비법까지 찾아내고 있어요!";

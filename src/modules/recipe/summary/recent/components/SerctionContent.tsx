import { LoadingView } from "@/src/modules/shared/components/layout/LoadingView";
import { RecentSummaryRecipe } from "../types/Recipe";
import { useRecentSummaryViewModel } from "../viewmodels/useViewModels";
import RecentRecipeSummaryList from "./List";

interface Props {
  onPress: (recipe: RecentSummaryRecipe) => void;
}

export function RecentRecipeSectionContent({ onPress }: Props) {
  const { recentRecipes, loading } = useRecentSummaryViewModel();

  return (
    <LoadingView loading={loading} skeletonLayout="recentRecipes">
      <RecentRecipeSummaryList recipes={recentRecipes} onPress={onPress} />
    </LoadingView>
  );
}

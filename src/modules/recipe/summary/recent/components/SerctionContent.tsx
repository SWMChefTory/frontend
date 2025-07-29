import { LoadingView } from "@/src/modules/shared/components/layout/LoadingView";
import { RecentSummaryRecipe } from "../types/Recipe";
import { useRecentSummaryViewModel } from "../viewmodels/useViewModels";
import RecentRecipeSummaryList from "./List";
import { useEffect } from "react";

interface Props {
  onPress: (recipe: RecentSummaryRecipe) => void;
  onRefresh: number;
}

export function RecentRecipeSectionContent({ onPress, onRefresh }: Props) {
  const { recentRecipes, loading, refetch } = useRecentSummaryViewModel();

  useEffect(() => {
    refetch();
  }, [onRefresh]);

  return (
    <LoadingView loading={loading} skeletonLayout="recentRecipes">
      <RecentRecipeSummaryList recipes={recentRecipes} onPress={onPress} />
    </LoadingView>
  );
}

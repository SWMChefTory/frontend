import { PopularSummaryRecipe } from "../types/Recipe";
import { PopularRecipeSummaryList } from "./List";
import { usePopularSummaryViewModel } from "../viewmodels/useViewModels";
import { LoadingView } from "@/src/modules/shared/components/layout/LoadingView";
import { useEffect } from "react";

interface Props {
  onPress: (recipe: PopularSummaryRecipe) => void;
  onRefresh: number;
}

export function PopularRecipeSectionContent({ onPress, onRefresh }: Props) {
  const { popularRecipes, loading, refetch } = usePopularSummaryViewModel();

  useEffect(() => {
    refetch();
  }, [onRefresh]);

  return (
    <LoadingView loading={loading} skeletonLayout="popularRecipes">
      <PopularRecipeSummaryList recipes={popularRecipes} onPress={onPress} />
    </LoadingView>
  );
}

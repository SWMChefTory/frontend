import { PopularSummaryRecipe } from "../types/Recipe";
import { PopularRecipeSummaryList } from "./List";
import { usePopularSummaryViewModel } from "../viewmodels/useViewModels";
import { LoadingView } from "@/src/modules/shared/components/layout/LoadingView";

interface Props {
  onPress: (recipe: PopularSummaryRecipe) => void;
}

export function PopularRecipeSectionContent({ onPress }: Props) {
  const { popularRecipes, loading } = usePopularSummaryViewModel();

  return (
    <LoadingView loading={loading} skeletonLayout="popularRecipes">
      <PopularRecipeSummaryList recipes={popularRecipes} onPress={onPress} />
    </LoadingView>
  );
}

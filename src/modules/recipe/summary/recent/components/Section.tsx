import { View, StyleSheet } from "react-native";
import { RecentSummaryRecipe } from "../types/Recipe";
import { RecipeSectionHeader } from "../../shared/components/SectionHeader";
import { RecentRecipeError } from "../shared/Fallback";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { useEffect } from "react";
import { useRecentSummaryViewModel } from "../viewmodels/useViewModels";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { RecentRecipesSkeleton } from "../shared/Skeleton";
import { Suspense } from "react";
import RecentRecipeSummaryList from "./List";

interface Props {
  onRecipePress: (recipe: RecentSummaryRecipe) => void;
  onViewAllPress: () => void;
  onRefresh: number;
}

export function RecentRecipeSection({
  onRecipePress,
  onViewAllPress,
  onRefresh,
}: Props) {
  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader
        title="최근 시청한 레시피"
        onPress={onViewAllPress}
      />
      <ApiErrorBoundary fallbackComponent={RecentRecipeError}>
        <Suspense
          fallback={
            <DeferredComponent>
              <RecentRecipesSkeleton />
            </DeferredComponent>
          }
        >
          <RecentRecipeSectionContent
            onPress={onRecipePress}
            onRefresh={onRefresh}
          />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

interface RecentRecipeSectionContentProps {
  onPress: (recipe: RecentSummaryRecipe) => void;
  onRefresh: number;
}

function RecentRecipeSectionContent({
  onPress,
  onRefresh,
}: RecentRecipeSectionContentProps) {
  const { recentRecipes, refetch } = useRecentSummaryViewModel();

  useEffect(() => {
    refetch();
  }, [onRefresh]);

  return <RecentRecipeSummaryList recipes={recentRecipes} onPress={onPress} />;
}

const styles = StyleSheet.create({
  recipeSectionCard: {
    height: 250,
    backgroundColor: COLORS.priamry.cook,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

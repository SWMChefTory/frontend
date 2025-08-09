import { View, StyleSheet } from "react-native";
import { RecentSummaryRecipe } from "../types/Recipe";
import { RecipeSectionHeader } from "../../shared/components/SectionHeader";
import { RecentRecipeError } from "../shared/Fallback";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { useEffect, Suspense, useRef, useCallback } from "react";
import { useRecentSummaryViewModel } from "../viewmodels/useViewModels";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { RecentRecipesSkeleton } from "../shared/Skeleton";
import RecentRecipeSummaryList from "./List";
import { useFocusEffect, useRouter } from "expo-router";
import { throttle } from "lodash";

interface Props {
  onRefresh: number;
}

export function RecentRecipeSection({ onRefresh }: Props) {
  const router = useRouter();

  const handleRecipePress = useRef(
    throttle(
      (recipe: RecentSummaryRecipe) => {
        router.push({
          pathname: "/recipe/detail",
          params: {
            recipeId: recipe.recipeId,
            youtubeId: recipe.youtubeId,
            title: recipe.title,
          },
        });
      },
      2000,
      {
        leading: true,
        trailing: false,
      },
    ),
  ).current;

  const handleViewAllPress = useRef(
    throttle(
      () => {
        router.push("/recipe/recent");
      },
      2000,
      {
        leading: true,
        trailing: false,
      },
    ),
  ).current;

  return (
    <View style={styles.recipeSectionCard}>
      <RecipeSectionHeader
        title="최근 시청한 레시피"
        onPress={handleViewAllPress}
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
            onPress={handleRecipePress}
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
  }, [onRefresh, refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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

import { View, StyleSheet } from "react-native";
import { RecentRecipe } from "@/src/modules/recipe/types/Recipe";
import { RecipeSectionHeader } from "../../components/SectionHeader";
import { RecentRecipeError } from "../shared/Fallback";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { useEffect, Suspense, useRef } from "react";
import { useRecentSummaryViewModel } from "../viewmodels/useViewModels";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { RecentRecipesSkeleton } from "../shared/Skeleton";
import RecentRecipeSummaryList from "./List";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { CARD_STYLES } from "@/src/modules/shared/constants/card";
import { useRefreshOnFocus } from "@/src/modules/shared/utils/useRefreshOnFocus";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  onRefresh: number;
}

export function RecentRecipeSection({ onRefresh }: Props) {
  const router = useRouter();

  const handleRecipePress = useRef(
    debounce(
      (recipe: RecentRecipe) => {
        router.push({
          pathname: "/recipe/detail",
          params: {
            recipeId: recipe.recipeId,
            youtubeId: recipe.youtubeId,
            title: recipe.title,
          },
        });
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
  ).current;

  const handleViewAllPress = useRef(
    debounce(
      () => {
        router.push("/recipe/recent");
      },
      1000,
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
  onPress: (recipe: RecentRecipe) => void;
  onRefresh: number;
}

function RecentRecipeSectionContent({
  onPress,
  onRefresh,
}: RecentRecipeSectionContentProps) {
  const { recentRecipes, refetch } = useRecentSummaryViewModel();

  useRefreshOnFocus(refetch);

  useEffect(() => {
    refetch();
  }, [onRefresh]);

  return <RecentRecipeSummaryList recipes={recentRecipes} onPress={onPress} />;
}

const styles = StyleSheet.create({
  recipeSectionCard: {
    ...CARD_STYLES.large,
    paddingVertical: responsiveHeight(24),
    marginBottom: responsiveHeight(24),
    ...SHADOW,
  },
});

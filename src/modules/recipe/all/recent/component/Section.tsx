import { Suspense, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { AllRecentRecipeCard } from "@/src/modules/recipe/all/recent/component/Card";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useRecentSummaryViewModel } from "@/src/modules/recipe/summary/recent/viewmodels/useViewModels";
import { useRouter } from "expo-router";
import { AllRecipeEmptyState } from "@/src/modules/recipe/all/EmptyState";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { AllRecentRecipesSkeleton } from "@/src/modules/recipe/all/recent/component/Skeleton";
import { AllRecentRecipeError } from "@/src/modules/recipe/all/recent/component/Fallback";

export function AllRecentRecipeSection() {
  return (
    <View style={styles.container}>
      <ApiErrorBoundary fallbackComponent={AllRecentRecipeError}>
        <Suspense
          fallback={
            <DeferredComponent>
              <AllRecentRecipesSkeleton />
            </DeferredComponent>
          }
        >
          <AllRecentRecipeSectionContent />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

export function AllRecentRecipeSectionContent() {
  const { recentRecipes, refetch } = useRecentSummaryViewModel();
  const router = useRouter();

  const handleRecipeView = useCallback(
    (recipe: RecentSummaryRecipe) => {
      router.push({
        pathname: "/recipe/detail",
        params: { recipeId: recipe.recipeId },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: RecentSummaryRecipe }) => (
      <AllRecentRecipeCard recipe={item} onPress={handleRecipeView} />
    ),
    [handleRecipeView],
  );

  const renderEmptyState = useCallback(() => {
    return (
      <AllRecipeEmptyState
        title="아직 시청한 영상이 없어요"
        subtitle={`요리 영상을 시청하고${"\n"}맛있는 레시피를 만들어보세요`}
        iconName="restaurant-outline"
        buttonText="다시 확인하기"
        onRefresh={refetch}
      />
    );
  }, [refetch]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <FlatList
      data={recentRecipes}
      keyExtractor={(item) => item.recipeId}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={handleRefresh}
          colors={[COLORS.orange.main]}
          tintColor={COLORS.orange.main}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 16,
  },
});

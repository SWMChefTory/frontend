import { Suspense, useCallback, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { AllRecentRecipeCard } from "@/src/modules/recipe/all/recent/component/Card";
import { RecentRecipe } from "@/src/modules/recipe/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useRecentAllViewModel } from "@/src/modules/recipe/all/recent/viewmodels/useViewModels";
import { useRouter } from "expo-router";
import { AllRecipeEmptyState } from "@/src/modules/recipe/all/components/EmptyState";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { AllRecentRecipesSkeleton } from "@/src/modules/recipe/all/recent/component/Skeleton";
import { AllRecentRecipeError } from "@/src/modules/recipe/all/recent/component/Fallback";
import { debounce } from "lodash";
import {
  responsiveWidth,
  responsiveHeight,
} from "@/src/modules/shared/utils/responsiveUI";

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
  const {
    recentRecipes,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRecentAllViewModel();
  const router = useRouter();
  
  const handleRecipeView = useRef(
    debounce(
      (recipe: RecentRecipe) => {
        router.push({
          pathname: "/recipe/detail",
          params: { recipeId: recipe.recipeId },
        });
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
  ).current;

  const renderItem = useCallback(
    ({ item }: { item: RecentRecipe }) => (
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

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.orange.main} />
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <FlatList
      data={recentRecipes}
      keyExtractor={(item) => item.recipeId}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={renderEmptyState}
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
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
    padding: responsiveWidth(16),
    paddingBottom: responsiveHeight(100),
  },
  separator: {
    height: responsiveHeight(16),
  },
  footerLoader: {
    paddingVertical: responsiveHeight(20),
    alignItems: "center",
    justifyContent: "center",
  },
});

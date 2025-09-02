import React, { Suspense, useCallback, useRef } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { AllPopularRecipeCard } from "@/src/modules/recipe/all/popular/component/Card";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import {
  usePopularSummaryViewModel,
  useRecipeCreateViewModel,
} from "@/src/modules/recipe/summary/popular/viewmodels/useViewModels";
import { useRouter } from "expo-router";
import { AllRecipeEmptyState } from "@/src/modules/recipe/all/EmptyState";
import { ApiErrorBoundary } from "@/src/modules/shared/components/error/ApiErrorBoundary";
import { DeferredComponent } from "@/src/modules/shared/utils/DeferredComponent";
import { AllPopularRecipeError } from "./Fallback";
import { AllPopularRecipesSkeleton } from "./Skeleton";
import { debounce } from "lodash";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";

export function AllPopularRecipeSection() {
  return (
    <View style={styles.container}>
      <ApiErrorBoundary fallbackComponent={AllPopularRecipeError}>
        <Suspense
          fallback={
            <DeferredComponent>
              <AllPopularRecipesSkeleton />
            </DeferredComponent>
          }
        >
          <AllPopularRecipeSectionContent />
        </Suspense>
      </ApiErrorBoundary>
    </View>
  );
}

export function AllPopularRecipeSectionContent() {
  const { popularRecipes, refetch } = usePopularSummaryViewModel();
  const { create } = useRecipeCreateViewModel();
  const router = useRouter();

  const handleRecipeView = useRef(
    debounce(
      async (recipe: PopularSummaryRecipe) => {
        const recipeId = (await create(recipe.video_url))!.recipe_id;
        router.push({
          pathname: "/recipe/create",
          params: { recipeId },
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
    ({ item }: { item: PopularSummaryRecipe }) => {
      return (
        <View style={styles.itemContainer}>
          <AllPopularRecipeCard recipe={item} onPress={handleRecipeView} />
        </View>
      );
    },
    [handleRecipeView],
  );

  const renderEmptyState = useCallback(() => {
    return (
      <AllRecipeEmptyState
        title="아직 준비된 레시피가 없어요"
        subtitle={`맛있는 인기 레시피들을 준비하고 있어요${"\n"}조금만 기다려주세요!`}
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
      data={popularRecipes}
      numColumns={2}
      keyExtractor={(item) => item.recipeId}
      renderItem={renderItem}
      columnWrapperStyle={
        popularRecipes.length > 1 ? styles.columnWrapper : undefined
      }
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
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
    paddingHorizontal: responsiveWidth(16),
    paddingTop: responsiveHeight(8),
  },
  itemContainer: {
    flex: 1,
    maxWidth: "48%",
    margin: responsiveWidth(8),
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

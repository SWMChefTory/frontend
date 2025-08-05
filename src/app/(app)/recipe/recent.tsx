import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { Stack, Tabs, useRouter } from "expo-router";
import { useRecentSummaryViewModel } from "@/src/modules/recipe/summary/recent/viewmodels/useViewModels";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { AllRecipeEmptyState } from "@/src/modules/recipe/list/EmptyState";
import { AllRecentRecipeCard } from "@/src/modules/recipe/list/recent/component/AllRecipeCard";
import RecipeRecentHeader from "@/src/header/RecipeRecentHeader";

export default function RecentRecipeSummaryScreen() {

  const { recentRecipes, loading, refetch } = useRecentSummaryViewModel();
  const router = useRouter();

  const handleRecipeView = useCallback((recipe: RecentSummaryRecipe) => {
    router.push({
      pathname: "/recipe/detail",
      params: { recipeId: recipe.recipeId },
    });
  }, []);

  const renderItem = useCallback(({ item }: { item: RecentSummaryRecipe }) => (
    <AllRecentRecipeCard
      recipe={item}
      onPress={handleRecipeView}
    />
  ), [handleRecipeView]);

  const renderEmptyState = useCallback(() => {
    return (
      <AllRecipeEmptyState
        title="아직 시청한 영상이 없어요"
        subtitle={`요리 영상을 시청하고${'\n'}맛있는 레시피를 만들어보세요`}
        iconName="restaurant-outline"
        buttonText="다시 확인하기"
        onRefresh={refetch}
      />
    );
  }, [refetch]);

  return (
    <View style={styles.container}>
      {/* 영상 목록 */}
      <Stack.Screen
      name="recent"
      options={{
        header: () => (
          <Stack.Screen
            options={{
              header: () => (
                <RecipeRecentHeader />
              ),
            }}
          />
        ),
      }}
    />
      <FlatList
        data={recentRecipes}
        keyExtractor={(item) => item.recipeId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[COLORS.orange.main]}
            tintColor={COLORS.orange.main}
          />
        }
      />
    </View>
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
    justifyContent: "space-between",
  },
});
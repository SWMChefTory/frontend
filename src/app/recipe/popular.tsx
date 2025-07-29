import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { AllPopularRecipeCard } from "@/src/modules/recipe/list/popular/component/AllRecipeCard";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { usePopularSummaryViewModel } from "@/src/modules/recipe/summary/popular/viewmodels/useViewModels";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { AllRecipeEmptyState } from "@/src/modules/recipe/list/EmptyState";
import { Tabs } from "expo-router";
import { CheftoryHeader } from "@/src/modules/shared/components/header/CheftoryHeader";
import { Ionicons } from "@expo/vector-icons";
import { AllPopularRecipeTitle } from "@/src/modules/recipe/list/popular/component/AllRecipeHeader";
import { HomeHeader } from "@/src/modules/shared/components/header/HomeHeader";

export default function PopularRecipeSummaryScreen() {

  const { popularRecipes, loading, refetch } = usePopularSummaryViewModel();
  const router = useRouter();

  const handleRecipeView = useCallback((recipe: PopularSummaryRecipe) => {
    router.push({
      pathname: "/recipe/create",
      params: { recipeId: recipe.recipeId },
    });
  }, []);

  const renderItem = useCallback(({ item }: { item: PopularSummaryRecipe }) => {
    return (
      <View style={styles.itemContainer}>
        <AllPopularRecipeCard 
          recipe={item} 
          onPress={handleRecipeView}
        />
      </View>
    );
  }, [handleRecipeView]);

  const renderEmptyState = useCallback(() => {
    return (
      <AllRecipeEmptyState
        title="아직 준비된 레시피가 없어요"
        subtitle={`맛있는 인기 레시피들을 준비하고 있어요${'\n'}조금만 기다려주세요!`}
        iconName="restaurant-outline"
        buttonText="다시 확인하기"
        onRefresh={refetch}
      />
    );
  }, [refetch]);

  return (
    <View style={styles.container}>
      <Tabs.Screen
      name="popular"
      options={{
        header: () => (
          <CheftoryHeader 
            title={<AllPopularRecipeTitle />}
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        ),
      }}
    />
      <FlatList
        data={popularRecipes}
        numColumns={2}
        keyExtractor={(item) => item.recipeId}
        renderItem={renderItem}
        columnWrapperStyle={popularRecipes.length > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  itemContainer: {
    flex: 1,
    maxWidth: '48%',
    margin: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
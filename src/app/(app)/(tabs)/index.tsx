import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  RefreshControl,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef, useCallback } from "react";
import { HomeSectionHeader } from "@/src/modules/shared/components/layout/HomeSectionHeader";
import { RecentRecipeSection } from "@/src/modules/recipe/summary/recent/components/Section";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { PopularRecipeSection } from "@/src/modules/recipe/summary/popular/components/Secition";
import { COLORS } from "@/src/modules/shared/constants/colors";


export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  const handleRecipePress = (
    recipe: PopularSummaryRecipe | RecentSummaryRecipe,
  ) => {
    if (recipe instanceof PopularSummaryRecipe) {
      router.push({
        pathname: "/recipe/create",
        params: { recipeId: recipe.recipeId },
      });
    } else {
      router.push({
        pathname: "/recipe/detail",
        params: {
          recipeId: recipe.recipeId,
          youtubeId: recipe.youtubeId,
          title: recipe.title,
        },
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handlePopularViewAllPress = () => {
    router.push("/recipe/popular");
  };

  const handleRecentViewAllPress = () => {
    router.push("/recipe/recent");
  };

  // const headerAnimatedStyle = {
  //   shadowOpacity: scrollY.interpolate({
  //     inputRange: [0, 50],
  //     outputRange: [0.08, 0.25],
  //     extrapolate: 'clamp',
  //   }),
  //   shadowRadius: scrollY.interpolate({
  //     inputRange: [0, 50],
  //     outputRange: [12, 20],
  //     extrapolate: 'clamp',
  //   }),
  // };

  return (
    <View style={styles.container}>
      {/* <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <HomeSectionHeader
          title="맛있는 요리의 시작"
          subtitle="영상 링크로 간편하게 레시피를 만들어보세요"
        />
      </Animated.View> */}

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.orange.main}
            colors={[COLORS.orange.main]}
            progressBackgroundColor={COLORS.background.white}
            progressViewOffset={20}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <HomeSectionHeader
          title="맛있는 요리의 시작"
          subtitle="영상 링크로 간편하게 레시피를 만들어보세요"
        />
        <View style={styles.contentWrapper}>
          <RecentRecipeSection
            onRecipePress={handleRecipePress}
            onViewAllPress={handleRecentViewAllPress}
            onRefresh={refreshTrigger}
          />
          <PopularRecipeSection
            onRecipePress={handleRecipePress}
            onViewAllPress={handlePopularViewAllPress}
            onRefresh={refreshTrigger}
          />
          <View style={styles.bottomSpacer} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.priamry.main,
  },
  headerContainer: {
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    padding: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});

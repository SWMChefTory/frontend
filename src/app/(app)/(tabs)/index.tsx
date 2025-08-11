import { StyleSheet, View, Animated, RefreshControl } from "react-native";
import { useState, useRef, useCallback } from "react";
import { HomeSectionHeader } from "@/src/modules/shared/components/layout/HomeSectionHeader";
import { RecentRecipeSection } from "@/src/modules/recipe/summary/recent/components/Section";
import { PopularRecipeSection } from "@/src/modules/recipe/summary/popular/components/Secition";
import { COLORS } from "@/src/modules/shared/constants/colors";

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
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
          <PopularRecipeSection onRefresh={refreshTrigger} />
          <RecentRecipeSection onRefresh={refreshTrigger} />
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
    paddingVertical: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});

import {
  StyleSheet,
  View,
  Animated,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useState, useRef, useCallback, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { HomeSectionHeader } from "@/src/modules/shared/components/layout/HomeSectionHeader";
import { RecentRecipeSection } from "@/src/modules/recipe/summary/recent/components/Section";
import { PopularRecipeSection } from "@/src/modules/recipe/summary/popular/components/Secition";
import { COLORS } from "@/src/modules/shared/constants/colors";
import TimerModal from "@/src/modules/timer/components/TimerModal";
import { useHasActiveTimer } from "@/src/modules/timer/hooks/useCountdownTimer";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { track } from "@/src/modules/shared/utils/analytics";

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const hasActiveTimer = useHasActiveTimer();
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  useEffect(() => {
    track.screen("Home");
  }, []);

  const handleTimerPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleTimerModalClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const navigateToRecipe = useCallback(
    (recipeId: string, recipeTitle: string) => {
      router.replace({
        pathname: "/recipe/detail",
        params: {
          recipeId: recipeId,
          title: recipeTitle,
          isTimer: "true",
        },
      } as any);
    },
    [],
  );

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

      {hasActiveTimer && (
        <TouchableOpacity
          style={styles.timerFloatingButton}
          onPress={handleTimerPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="timer-outline"
            size={24}
            color={COLORS.background.white}
          />
        </TouchableOpacity>
      )}

        <TimerModal
          bottomSheetModalRef={bottomSheetModalRef}
            onRequestClose={handleTimerModalClose}
            recipeTitle={""}
            recipeId={""}
            onNavigateToRecipe={navigateToRecipe}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary.main,
  },
  headerContainer: {
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    paddingVertical: responsiveHeight(20),
  },
  bottomSpacer: {
    height: 100,
  },
  timerFloatingButton: {
    position: "absolute",
    right: responsiveWidth(20),
    bottom: responsiveHeight(30),
    width: responsiveWidth(56),
    height: responsiveHeight(56),
    borderRadius: responsiveWidth(28),
    backgroundColor: COLORS.orange.main,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },
});

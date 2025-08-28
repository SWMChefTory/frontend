import { RecipeWebView } from "@/src/modules/recipe/detail/components/RecipeWebView";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import TimerModal from "@/src/modules/timer/components/TimerModal";
import { RecipeCategoryBottomSheet } from "@/src/modules/recipe/create/step/components/BottomSheet";
import { TimerMessage } from "@/src/modules/recipe/detail/types/RecipeDetail";

export default function RecipeDetailScreen() {
  const [timerMessage, setTimerMessage] = useState<TimerMessage | null>(null);
  const router = useRouter();

  const params = useLocalSearchParams<{
    recipeId: string;
    youtubeId?: string;
    title?: string;
    isTimer?: string;
    isCreated: string;
  }>();

  const modalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const isCreated = params.isCreated === "true";
  const isTimer = params.isTimer === "true";

  useEffect(() => {
    if (isCreated) {
      modalRef.current?.present();
    }
  }, []);

  useEffect(() => {
    if (isTimer) {
      bottomSheetModalRef.current?.present();
    }
  }, []);

  const openTimerModal = useCallback((msg: TimerMessage) => {
    setTimerMessage(msg);
    bottomSheetModalRef.current?.present();
  }, []);

  const closeTimerModal = useCallback(() => {
    setTimerMessage(null);
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
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        translucent={false}
      />
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <RecipeWebView
          recipeId={params.recipeId}
          onOpenTimer={openTimerModal}
        />
          <TimerModal
            onRequestClose={closeTimerModal}
            recipeTitle={params.title || timerMessage?.recipe_title || ""}
            recipeId={params.recipeId || timerMessage?.recipe_id || ""}
            timerAutoTime={timerMessage?.timer_time}
            timerIntentType={timerMessage?.type}
            onNavigateToRecipe={navigateToRecipe}
            bottomSheetModalRef={bottomSheetModalRef}
          />
        <RecipeCategoryBottomSheet
          modalRef={modalRef}
          recipeId={params.recipeId}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

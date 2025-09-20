import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecipeCategoryBottomSheet } from "@/src/modules/recipe/category/categories/bottomsheet/BottomSheet";
import { RecipeWebView } from "@/src/modules/recipe/detail/components/RecipeWebView";
import { TimerMessage } from "@/src/modules/recipe/detail/types/RecipeDetail";
import { track } from "@/src/modules/shared/utils/analytics";
import TimerModal from "@/src/modules/timer/components/TimerModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RecipeDetailScreen() {
  const [timerMessage, setTimerMessage] = useState<TimerMessage | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  useEffect(() => {
    track.screen("RecipeDetail");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: false,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: true,
        });
      } catch (e) {
        console.warn("Failed to set audio mode", e);
      }
    })();

    return () => {
      (async () => {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            shouldDuckAndroid: true,
            staysActiveInBackground: false,
            playThroughEarpieceAndroid: false,
          });
        } catch (e) {
          console.warn("Failed to reset audio mode", e);
        }
      })();
    };
  }, []);

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
    []
  );

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        translucent={false}
      />
      <View style={[styles.container]} >
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    
    // width: "100%",
    // height: "100%",
  },
  // webview: {
});

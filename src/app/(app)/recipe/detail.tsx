import { RecipeWebView } from "@/src/modules/recipe/detail/components/RecipeWebView";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RecipeCategoryBottomSheet } from "@/src/modules/recipe/create/step/components/BottomSheet";

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams<{
    recipeId: string;
    youtubeId?: string;
    title?: string;
    isCreated: string;
  }>();

  const modalRef = useRef<BottomSheetModal>(null);

  const isCreated = params.isCreated === "true";

  useEffect(() => {
    if (isCreated) {
      modalRef.current?.present();
    }
  }, [isCreated]);

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

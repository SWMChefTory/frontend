import { LoadingOverlay } from "@/src/modules/recipe/detail/components/LoadingOverlay";
import { RecipeWebView } from "@/src/modules/recipe/detail/components/RecipeWebView";
import { useRecipeDetailViewModel } from "@/src/modules/recipe/detail/viewmodels/useRecipeDetailViewModel";
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

  const {
    isLoading,
    webViewKey,
    webviewUrl,
    webviewRef,
    handleMessage,
    handleLoadStart,
    handleLoadEnd,
    handleNavigationStateChange,
    accessToken,
  } = useRecipeDetailViewModel({
    recipeId: params.recipeId,
    youtubeId: params.youtubeId,
    title: params.title,
  });

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

        <LoadingOverlay isVisible={isLoading} />

        <RecipeWebView
          webViewRef={webviewRef}
          url={webviewUrl}
          webViewKey={webViewKey}
          onMessage={handleMessage}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onNavigationStateChange={handleNavigationStateChange}
          //onError={handleError}
          //onHttpError={handleHttpError}
          accessToken={accessToken}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView onError:", nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView onHttpError:", nativeEvent);
          }}
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

import { LoadingOverlay } from "@/src/modules/recipe/detail/components/LoadingOverlay";
import { RecipeWebView } from "@/src/modules/recipe/detail/components/RecipeWebView";
import { useRecipeDetailViewModel } from "@/src/modules/recipe/detail/viewmodels/useRecipeDetailViewModel";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams<{
    recipeId: string;
    youtubeId?: string;
    title?: string;
  }>();

  const {
    isLoading,
    webViewKey,
    webviewUrl,
    webviewRef,
    handleMessage,
    handleLoadStart,
    handleLoadEnd,
    handleNavigationStateChange,
    handleError,
    handleHttpError,
  } = useRecipeDetailViewModel({
    recipeId: params.recipeId,
    youtubeId: params.youtubeId,
    title: params.title,
  });

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
          onError={handleError}
          onHttpError={handleHttpError}
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

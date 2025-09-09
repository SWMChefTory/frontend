import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { COLORS } from "@/src/modules/shared/constants/colors";
import RecipePopularHeader from "@/src/header/RecipePopularHeader";
import { AllPopularRecipeSection } from "@/src/modules/recipe/all/popular/component/Section";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function AllPopularRecipeScreen() {
  useEffect(() => {
    track.screen("AllPopularRecipe");
  }, []);
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <RecipePopularHeader />,
        }}
      />
      <AllPopularRecipeSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});

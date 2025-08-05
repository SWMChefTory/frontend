import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { COLORS } from "@/src/modules/shared/constants/colors";
import RecipeRecentHeader from "@/src/header/RecipeRecentHeader";
import { AllRecentRecipeSection } from "@/src/modules/recipe/all/recent/component/Section";

export default function RecentRecipeSummaryScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <RecipeRecentHeader />,
        }}
      />
      <AllRecentRecipeSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});

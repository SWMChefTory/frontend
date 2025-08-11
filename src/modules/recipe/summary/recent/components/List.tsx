import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { RecentSummaryRecipe } from "../types/Recipe";
import { RecentRecipeSummaryCard } from "./Card";
import { EmptyStateCard } from "./EmptyCard";

type Props = {
  recipes: RecentSummaryRecipe[];
  onPress: (recipe: RecentSummaryRecipe) => void;
};

export default function RecentRecipeSummaryList({ recipes, onPress }: Props) {
  const renderEmptyState = () => {
    const emptyCards = Array(3).fill(null);

    return (
      <FlatList
        data={emptyCards}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `empty-${index}`}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        style={styles.container}
        renderItem={({ index }) => <EmptyStateCard isFirst={index === 0} />}
      />
    );
  };

  return (
    <View style={styles.wrapper}>
      {recipes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={recipes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.recipeId.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <RecentRecipeSummaryCard recipe={item} onPress={onPress} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
  },
  gap: { width: 12 },
  container: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

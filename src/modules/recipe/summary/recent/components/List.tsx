import { FlatList, StyleSheet, View } from "react-native";
import { RecentRecipe } from "@/src/modules/recipe/types/Recipe";
import { RecentRecipeSummaryCard } from "./Card";
import { EmptyStateCard } from "./EmptyCard";
import {
  responsiveWidth,
  responsiveHeight,
} from "@/src/modules/shared/utils/responsiveUI";

type Props = {
  recipes: RecentRecipe[];
  onPress: (recipe: RecentRecipe) => void;
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
          ItemSeparatorComponent={() => (
            <View style={{ width: responsiveWidth(12) }} />
          )}
          contentContainerStyle={{
            paddingHorizontal: responsiveWidth(16),
            paddingVertical: responsiveHeight(8),
          }}
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
  gap: { width: responsiveWidth(12) },
  container: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";

type Props = { itemCount?: number };
const ITEM_WIDTH_PERCENT = "32%";

export function CategoryRecipesSkeleton({ itemCount = 9 }: Props) {
  const data = Array.from({ length: itemCount }, (_, i) => i);

  const renderItem = () => (
    <View style={styles.card}>
      <Skeleton
        isLoading
        layout={[
          {
            key: "img",
            width: "100%",
            height: 80,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginBottom: 0,
          },
          {
            key: "body",
            width: "100%",
            paddingHorizontal: 12,
            paddingTop: 12,
            children: [
              {
                key: "title",
                width: "100%",
                height: 13,
                borderRadius: 3,
                marginBottom: 6,
              },
              {
                key: "progress",
                width: "100%",
                height: 3,
                borderRadius: 2,
                marginBottom: 4,
              },
              {
                key: "progressTxt",
                width: "65%",
                height: 11,
                borderRadius: 3,
              },
            ],
          },
        ]}
        boneColor={COLORS.skeleton.bone}
        highlightColor={COLORS.skeleton.highlight}
        animationType="pulse"
        duration={1200}
      />
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.toString()}
      renderItem={renderItem}
      numColumns={3}
      columnWrapperStyle={styles.recipeColumnWrapper}
      contentContainerStyle={styles.listContentContainer}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  recipeColumnWrapper: {
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
  card: {
    width: ITEM_WIDTH_PERCENT,
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    paddingBottom: 12,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
});

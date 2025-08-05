import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";

type Props = { itemCount?: number };

export function PopularRecipesSkeleton({ itemCount = 4 }: Props) {
  const data = Array.from({ length: itemCount }, (_, i) => i);

  const renderItem = () => (
    <View style={styles.card}>
      <Skeleton
        isLoading
        layout={[
          {
            key: "cardContent",
            width: "100%",
            height: "100%",
            paddingHorizontal: 12,
            paddingTop: 16,
            paddingBottom: 12,
            children: [
              {
                key: "image",
                width: "100%",
                height: 80,
                borderRadius: 12,
                marginBottom: 6,
              },
              {
                key: "title1",
                width: "85%",
                height: 13,
                borderRadius: 4,
                marginBottom: 2,
              },
              {
                key: "title2",
                width: "70%",
                height: 13,
                borderRadius: 4,
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
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item) => item.toString()}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    minHeight: 288,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  card: {
    width: "48%",
    height: 180,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border.orangeLight,
  },
});

import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SKELETON_SHADOW } from "@/src/modules/shared/constants/shadow";

type Props = { itemCount?: number };

export function RecentRecipesSkeleton({ itemCount = 3 }: Props) {
  const data = Array.from({ length: itemCount }, (_, i) => i);

  const renderItem = () => (
    <View style={styles.card}>
      <Skeleton
        isLoading
        layout={[
          {
            key: "image",
            width: "100%",
            height: 80,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
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
                width: "90%",
                height: 13,
                borderRadius: 4,
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
                key: "progressText",
                width: "60%",
                height: 11,
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
    <View style={styles.wrapper}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    minHeight: 156,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    width: 12,
  },
  card: {
    width: 140,
    backgroundColor: COLORS.priamry.main,
    borderRadius: 16,
    paddingBottom: 12,
    ...SKELETON_SHADOW,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
});

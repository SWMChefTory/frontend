import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";

type Props = { itemCount?: number };

export function CategoryListSkeleton({ itemCount = 6 }: Props) {
  const data = Array.from({ length: itemCount }, (_, i) => i);

  const renderItem = () => (
    <View style={styles.card}>
      <Skeleton
        isLoading
        layout={[
          // 카드 전체 컨테이너
          {
            key: "content",
            width: "100%",
            height: "100%",
            paddingHorizontal: 12,
            paddingVertical: 12,
            children: [
              // 아이콘 컨테이너 (40x40, 원형)
              {
                key: "iconContainer",
                width: 40,
                height: 40,
                borderRadius: 20,
                alignSelf: "center",
                marginBottom: 8,
              },
              // 카테고리 이름
              {
                key: "categoryName",
                width: "80%",
                height: 14, // fontSize 14
                borderRadius: 3,
                alignSelf: "center",
                marginBottom: 4,
              },
              // 카운트 텍스트
              {
                key: "count",
                width: "50%",
                height: 11, // fontSize 11
                borderRadius: 3,
                alignSelf: "center",
              },
            ],
          },
          // 삭제 버튼 (우상단)
          {
            key: "deleteButton",
            width: 20,
            height: 20,
            borderRadius: 10,
            position: "absolute",
            top: 6,
            right: 6,
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
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  separator: {
    width: 8,
  },
  card: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    shadowColor: COLORS.shadow.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    position: "relative",
  },
});

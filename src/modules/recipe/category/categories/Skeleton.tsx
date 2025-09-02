import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { SKELETON_SHADOW } from "@/src/modules/shared/constants/shadow";

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
            paddingHorizontal: responsiveWidth(12),
            paddingVertical: responsiveHeight(12),
            children: [
              // 아이콘 컨테이너 (40x40, 원형)
              {
                key: "iconContainer",
                width: responsiveWidth(40),
                height: responsiveHeight(40),
                borderRadius: responsiveWidth(20),
                alignSelf: "center",
                marginBottom: 8,
              },
              // 카테고리 이름
              {
                key: "categoryName",
                width: "80%",
                height: responsiveHeight(14), // fontSize 14
                borderRadius: responsiveWidth(3),
                alignSelf: "center",
                marginBottom: 4,
              },
              // 카운트 텍스트
              {
                key: "count",
                width: "50%",
                height: responsiveHeight(11), // fontSize 11
                borderRadius: responsiveWidth(3),
                alignSelf: "center",
              },
            ],
          },
          // 삭제 버튼 (우상단)
          {
            key: "deleteButton",
            width: responsiveWidth(20),
            height: responsiveHeight(20),
            borderRadius: responsiveWidth(10),
            position: "absolute",
            top: responsiveHeight(6),
            right: responsiveWidth(6),
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
    height: responsiveHeight(100),
  },
  contentContainer: {
    paddingHorizontal: responsiveWidth(10),
  },
  separator: {
    width: responsiveWidth(8),
  },
  card: {
    width: responsiveWidth(120),
    height: responsiveHeight(120),
    backgroundColor: COLORS.background.white,
    borderRadius: responsiveWidth(12),
    ...SKELETON_SHADOW,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    position: "relative",
  },
});

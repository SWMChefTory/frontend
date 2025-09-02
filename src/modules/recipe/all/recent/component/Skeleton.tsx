import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { SKELETON_SHADOW } from "@/src/modules/shared/constants/shadow";

type Props = { itemCount?: number };

export function AllRecentRecipesSkeleton({ itemCount = 5 }: Props) {
  const data = Array.from({ length: itemCount }, (_, i) => i);

  const renderItem = () => (
    <View style={styles.card}>
      <Skeleton
        isLoading
        layout={[
          // 카드 전체 레이아웃 (세로 방향 리스트)
          {
            key: "cardContent",
            width: "100%",
            height: "100%",
            children: [
              // 썸네일 이미지
              {
                key: "thumbnail",
                width: "100%",
                height: responsiveHeight(120), // AllRecentRecipeCard 높이에 맞춤
                borderRadius: 12,
                marginBottom: responsiveHeight(12)  ,
              },
              // 제목 (1줄)
              {
                key: "title",
                width: "85%",
                height: responsiveHeight(16), // AllRecentRecipeCard의 title fontSize
                borderRadius: 4,
                marginBottom: responsiveHeight(8),
              },
              // 메타 정보 (날짜, 시청 시간 등)
              {
                key: "metaInfo",
                width: "60%",
                height: responsiveHeight(12), // 작은 폰트 크기
                borderRadius: 3,
                marginBottom: responsiveHeight(8),
              },
              // 프로그레스 바 (시청 진행률)
              {
                key: "progressBar",
                width: "100%",
                height: responsiveHeight(4),
                borderRadius: 2,
                marginBottom: responsiveHeight(4),
              },
              // 프로그레스 텍스트
              {
                key: "progressText",
                width: "40%",
                height: responsiveHeight(10),
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
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
  listContainer: {
    padding: responsiveWidth(16),
    paddingBottom: responsiveHeight(100), // AllRecentRecipeSection과 동일
  },
  separator: {
    height: responsiveHeight(16), // AllRecentRecipeSection separator와 동일
  },
  card: {
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    padding: responsiveWidth(16),
    ...SKELETON_SHADOW,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    // 세로 리스트이므로 높이 자동 조정
    minHeight: responsiveHeight(200), // 적절한 최소 높이
  },
});

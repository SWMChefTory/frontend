import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import Carousel from "react-native-reanimated-carousel";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

const { width: screenWidth } = Dimensions.get("window");

type Props = { itemCount?: number };

export function PopularRecipesSkeleton({ itemCount = 3 }: Props) {
  const cardWidth = screenWidth;
  const aspectRatio = 16 / 9;
  const cardHeight = cardWidth / aspectRatio;

  // 스켈레톤 데이터 생성
  const skeletonData = Array.from({ length: itemCount }, (_, i) => ({ id: i }));

  const renderSkeletonCard = ({ item }: { item: { id: number } }) => (
    <View style={styles.cardWrapper}>
      <View style={[styles.skeletonCard, { height: cardHeight }]}>
        <Skeleton
          isLoading
          layout={[
            {
              key: "cardContent",
              width: "100%",
              height: "100%",
              children: [
                {
                  key: "image",
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                },
                // YouTube 로고 위치
                {
                  key: "youtubeLogo",
                  width: 38,
                  height: 38,
                  borderRadius: 16,
                  position: "absolute",
                  top: 12,
                  right: 12,
                },
                // TOP 배지 위치
                {
                  key: "topBadge",
                  width: 80,
                  height: 36,
                  borderRadius: 12,
                  position: "absolute",
                  top: 12,
                  left: 12,
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
    </View>
  );

  const renderMetaInfoSkeleton = () => (
    <View style={styles.metaOverlay}>
      <View style={styles.metaContainer}>
        <Skeleton
          isLoading
          layout={[
            {
              key: "metaContent",
              width: "100%",
              height: "100%",
              children: [
                // 제목
                {
                  key: "title",
                  width: "85%",
                  height: 20,
                  borderRadius: 4,
                  marginBottom: 12,
                },
                // 메타 정보 행
                {
                  key: "metaRow",
                  width: "100%",
                  height: 32,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  children: [
                    // 조회수
                    {
                      key: "viewCount",
                      width: 80,
                      height: 32,
                      borderRadius: 20,
                    },
                    // 인덱스
                    {
                      key: "index",
                      width: 50,
                      height: 24,
                      borderRadius: 12,
                    },
                  ],
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
    </View>
  );

  const renderIndicatorsSkeleton = () => (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: itemCount }, (_, i) => (
        <View
          key={i}
          style={[
            styles.indicatorSkeleton,
            i === 0 ? styles.activeIndicatorSkeleton : {},
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.carouselContainer}>
        <Carousel
          data={skeletonData}
          height={cardHeight}
          width={screenWidth}
          loop={false}
          pagingEnabled
          snapEnabled
          scrollAnimationDuration={800}
          style={styles.carousel}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 90,
            parallaxAdjacentItemScale: 0.7,
          }}
          renderItem={renderSkeletonCard}
          enabled={false} // 스켈레톤에서는 스크롤 비활성화
        />
        {renderMetaInfoSkeleton()}
      </View>
      {renderIndicatorsSkeleton()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 16,
  },
  carouselContainer: {
    position: "relative",
    paddingBottom: 100,
  },
  carousel: {
    alignSelf: "center",
  },
  cardWrapper: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonCard: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    overflow: "hidden",
  },
  metaOverlay: {
    position: "absolute",
    bottom: 0,
    left: 30,
    right: 30,
    zIndex: 10,
  },
  metaContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    ...SHADOW,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    gap: 12,
  },
  indicatorSkeleton: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.skeleton.bone,
  },
  activeIndicatorSkeleton: {
    width: 24,
    backgroundColor: COLORS.skeleton.highlight,
  },
});

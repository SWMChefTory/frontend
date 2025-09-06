import React, { useState, useCallback, useRef, useEffect } from "react";
import { Dimensions, StyleSheet, View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { PopularRecipe } from "../../../types/Recipe";
import { PopularRecipeSummaryCard } from "./Card";
import { EmptyStateCard } from "../../recent/components/EmptyCard";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";

type Props = {
  recipes: PopularRecipe[];
  onPress: (recipe: PopularRecipe) => void;
};

const { width: screenWidth } = Dimensions.get("window");

export default function PopularRecipeSummaryList({ recipes, onPress }: Props) {
  const progress = useSharedValue<number>(0); // 필요 시 사용
  const absProgress = useSharedValue<number>(0); // 인디케이터 애니메이션용
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const cardWidth = screenWidth;
  const aspectRatio = 16 / 9;
  const cardHeight = cardWidth / aspectRatio;

  // recipes 길이가 바뀔 때 인덱스 보정
  useEffect(() => {
    if (recipes.length === 0) return;
    if (currentIndex >= recipes.length) {
      const last = recipes.length - 1;
      setCurrentIndex(last);
      carouselRef.current?.scrollTo?.({ index: last, animated: false });
    }
  }, [recipes.length, currentIndex]);

  const renderPopularRecipeItem = useCallback(
    (onPressCb: (recipe: PopularRecipe) => void) => {
      return ({ item }: { item: PopularRecipe }) => {
        return (
          <View style={styles.cardWrapper}>
            <PopularRecipeSummaryCard recipe={item} onPress={onPressCb} />
          </View>
        );
      };
    },
    [],
  );

  const renderEmptyItem = ({ index }: { index: number }) => {
    return (
      <View style={[styles.cardWrapper, styles.emptyCardWrapper]}>
        <EmptyStateCard isFirst={index === 0} />
      </View>
    );
  };

  const renderEmptyState = () => {
    const emptyCards = Array(3).fill(null);

    return (
      <Carousel
        data={emptyCards}
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
          parallaxScrollingOffset: 50,
        }}
        renderItem={renderEmptyItem}
      />
    );
  };

  const formatViewCount = (count: number): string => {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`;
    } else if (count >= 10_000) {
      return `${Math.floor(count / 1_000)}k`;
    } else if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleProgressChange = useCallback(
    (offsetProgress: number, absoluteProgress: number) => {
      // 인덱스는 onSnapToItem에서 확정, 여기서는 애니메이션용 값만 저장
      absProgress.value = absoluteProgress;
      progress.value = offsetProgress;
    },
    [absProgress, progress],
  );

  const handleIndicatorPress = useCallback((index: number) => {
    setCurrentIndex(index);
    carouselRef.current?.scrollTo?.({ index, animated: true });
  }, []);

  const renderMetaInfo = () => {
    if (recipes.length === 0) return null;

    const currentRecipe = recipes[currentIndex];
    if (!currentRecipe) return null;

    return (
      <View style={styles.metaOverlay}>
        <View style={styles.metaContainer}>
          <Text
            style={styles.recipeTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentRecipe.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.viewCountContainer}>
              <Text style={styles.viewCountLabel}>조회수</Text>
              <Text style={styles.viewCountValue}>
                {formatViewCount(currentRecipe.count)}
              </Text>
            </View>
            <View style={styles.indexContainer}>
              <Text style={styles.indexText}>
                {currentIndex + 1} / {recipes.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const Dot = ({
    i,
    length,
    onPress,
  }: {
    i: number;
    length: number;
    onPress: () => void;
  }) => {
    // 루프 캐러셀에서 가장 가까운 거리 계산
    const rStyle = useAnimatedStyle(() => {
      const diff = Math.abs(absProgress.value - i);
      const wrapped = Math.min(diff, length - diff);

      const width = interpolate(wrapped, [0, 1], [24, 8], Extrapolate.CLAMP);
      const opacity = interpolate(wrapped, [0, 1], [1, 0.5], Extrapolate.CLAMP);
      const scale = interpolate(wrapped, [0, 1], [1, 0.95], Extrapolate.CLAMP);

      return { width, opacity, transform: [{ scale }] };
    });

    return (
      <Pressable
        onPress={onPress}
        hitSlop={{
          top: responsiveHeight(8),
          bottom: responsiveHeight(8),
          left: responsiveWidth(8),
          right: responsiveWidth(8),
        }}
        accessibilityRole="button"
        accessibilityLabel={`슬라이드 ${i + 1}로 이동`}
        style={{ paddingHorizontal: responsiveWidth(4) }}
      >
        <Animated.View style={[styles.indicator, rStyle]} />
      </Pressable>
    );
  };

  const renderProgressIndicators = () => {
    if (recipes.length === 0) return null;

    return (
      <View style={styles.indicatorContainer}>
        {recipes.map((_, index) => (
          <Dot
            key={index}
            i={index}
            length={recipes.length}
            onPress={() => handleIndicatorPress(index)}
          />
        ))}
      </View>
    );
  };

  if (recipes.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>인기 레시피</Text>
          <Text style={styles.sectionSubtitle}>아직 인기 레시피가 없어요</Text>
        </View>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          autoPlay
          autoPlayInterval={2000}
          data={recipes}
          height={cardHeight}
          width={screenWidth}
          loop
          pagingEnabled={true}
          snapEnabled
          scrollAnimationDuration={500}
          style={styles.carousel}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 90,
            parallaxAdjacentItemScale: 0.7,
          }}
          onProgressChange={handleProgressChange}
          onSnapToItem={setCurrentIndex}
          renderItem={renderPopularRecipeItem(onPress)}
        />
        {renderMetaInfo()}
      </View>

      {renderProgressIndicators()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: responsiveHeight(16),
  },
  headerContainer: {
    paddingHorizontal: responsiveWidth(20),
    marginBottom: responsiveHeight(16),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: responsiveHeight(4),
  },
  sectionSubtitle: {
    fontSize: responsiveFontSize(15),
    fontWeight: "400",
    color: "#666666",
  },
  carouselContainer: {
    position: "relative",
    paddingBottom: responsiveHeight(100),
  },
  carousel: {
    alignSelf: "center",
  },
  cardWrapper: {
    paddingHorizontal: responsiveWidth(10),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCardWrapper: {
    flex: 1,
  },
  metaOverlay: {
    position: "absolute",
    bottom: responsiveHeight(0),
    left: responsiveWidth(30),
    right: responsiveWidth(30),
    zIndex: 10,
  },
  metaContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: responsiveWidth(20),
    ...SHADOW,
  },
  recipeTitle: {
    color: "#000000",
    fontSize: responsiveFontSize(20),
    fontWeight: "700",
    marginBottom: responsiveHeight(12),
    lineHeight: responsiveHeight(24),
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: responsiveWidth(12),
    paddingVertical: responsiveHeight(6),
    borderRadius: 20,
  },
  viewCountLabel: {
    color: "#000000",
    fontSize: responsiveFontSize(13),
    fontWeight: "400",
    marginRight: responsiveWidth(6),
  },
  viewCountValue: {
    color: "#000000",
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
  },
  indexContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(4),
    borderRadius: 12,
  },
  indexText: {
    color: "#000000",
    fontSize: responsiveFontSize(12),
    fontWeight: "500",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: responsiveHeight(20),
  },
  indicator: {
    height: responsiveHeight(8),
    borderRadius: responsiveWidth(4),
    backgroundColor: "#000000",
    // width/opacity/scale는 애니메이션에서 제어
  },
});

import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";

type Props = {
  hours?: number;
  minutes: number;
  seconds: number;
  onChange: (h: number, m: number, s: number) => void;
  hourMax?: number;
  minuteMax?: number;
  showHours?: boolean;
};

const ITEM_H = responsiveHeight(42);

const headerFooterStyle = { height: ITEM_H * 2 };

export default function DurationSelector({
  hours = 0,
  minutes,
  seconds,
  onChange,
  hourMax = 12,
  minuteMax = 59,
  showHours = false,
}: Props) {
  const [isScrolling, setIsScrolling] = useState(false);

  const hourData = useMemo(
    () => Array.from({ length: hourMax + 1 }, (_, i) => i),
    [hourMax],
  );
  const minData = useMemo(
    () => Array.from({ length: minuteMax + 1 }, (_, i) => i),
    [minuteMax],
  );
  const secData = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const hourRef = useRef<FlatList<number> | null>(null);
  const minRef = useRef<FlatList<number> | null>(null);
  const secRef = useRef<FlatList<number> | null>(null);

  // 스크롤 포지션 함수 최적화
  const scrollToPosition = useCallback(
    (
      ref: React.RefObject<FlatList<number> | null>,
      value: number,
      maxLength: number,
    ) => {
      if (ref.current && !isScrolling) {
        const safeIndex = Math.max(0, Math.min(maxLength - 1, value));
        // setTimeout 제거
        ref.current?.scrollToIndex({
          index: safeIndex,
          animated: true,
        });
      }
    },
    [isScrolling],
  );

  // useEffect를 각각 분리하여 불필요한 리렌더링 방지
  useEffect(() => {
    if (showHours) {
      scrollToPosition(hourRef, hours, hourData.length);
    }
  }, [hours, showHours, hourData.length, scrollToPosition]);

  useEffect(() => {
    scrollToPosition(minRef, minutes, minData.length);
  }, [minutes, minData.length, scrollToPosition]);

  useEffect(() => {
    scrollToPosition(secRef, seconds, secData.length);
  }, [seconds, secData.length, scrollToPosition]);

  const handleScrollBegin = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const currentValuesRef = useRef({ hours, minutes, seconds });
  currentValuesRef.current = { hours, minutes, seconds };
  const handleHourScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_H);
      const clampedIndex = Math.max(0, Math.min(hourData.length - 1, index));
      const { minutes: currentMinutes, seconds: currentSeconds } =
        currentValuesRef.current;
      onChange(clampedIndex, currentMinutes, currentSeconds);
      setIsScrolling(false);
    },
    [hourData.length, onChange], // 의존성 대폭 감소
  );

  const handleMinuteScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = event.nativeEvent;
      const index = Math.round(contentOffset.y / ITEM_H);
      const clampedIndex = Math.max(0, Math.min(minData.length - 1, index));
      onChange(hours, clampedIndex, seconds);
      setIsScrolling(false);
    },
    [minData.length, hours, seconds, onChange],
  );

  const handleSecondScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = event.nativeEvent;
      const index = Math.round(contentOffset.y / ITEM_H);
      const clampedIndex = Math.max(0, Math.min(secData.length - 1, index));
      onChange(hours, minutes, clampedIndex);
      setIsScrolling(false);
    },
    [secData.length, hours, minutes, onChange],
  );

  return (
    <View style={styles.wrap}>
      {showHours && (
        <>
          <View style={styles.col}>
            <View style={styles.list}>
              <Wheel
                data={hourData}
                value={hours}
                refList={hourRef}
                onScrollBegin={handleScrollBegin}
                onMomentumScrollEnd={handleHourScrollEnd}
              />
              <View style={styles.centerLine} />
            </View>
            <Text style={styles.unit}>시</Text>
          </View>
          <Text style={styles.sep}>:</Text>
        </>
      )}

      <View style={styles.col}>
        <View style={styles.list}>
          <Wheel
            data={minData}
            value={minutes}
            refList={minRef}
            onScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleMinuteScrollEnd}
          />
          <View style={styles.centerLine} />
        </View>
        <Text style={styles.unit}>분</Text>
      </View>

      <Text style={styles.sep}>:</Text>

      <View style={styles.col}>
        <View style={styles.list}>
          <Wheel
            data={secData}
            value={seconds}
            refList={secRef}
            onScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleSecondScrollEnd}
          />
          <View style={styles.centerLine} />
        </View>
        <Text style={styles.unit}>초</Text>
      </View>
    </View>
  );
}

// Wheel 컴포넌트 메모이제이션
const Wheel = React.memo(
  ({
    data,
    value,
    refList,
    onScrollBegin,
    onMomentumScrollEnd,
  }: {
    data: number[];
    value: number;
    refList: React.RefObject<FlatList<number> | null>;
    onScrollBegin: () => void;
    onMomentumScrollEnd: (
      event: NativeSyntheticEvent<NativeScrollEvent>,
    ) => void;
  }) => {
    const safeInitialIndex = useMemo(() => {
      return Math.max(0, Math.min(data.length - 1, value));
    }, [data.length, value]);

    // renderItem 메모이제이션
    const renderItem = useCallback(
      ({ item }: { item: number }) => (
        <View style={styles.item}>
          <Text style={styles.itemText}>
            {item.toString().padStart(2, "0")}
          </Text>
        </View>
      ),
      [],
    );

    // getItemLayout 메모이제이션
    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: ITEM_H,
        offset: ITEM_H * index,
        index,
      }),
      [],
    );

    return (
      <FlatList
        ref={refList}
        data={data}
        keyExtractor={(n) => String(n)}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true} // true로 변경
        getItemLayout={getItemLayout}
        initialScrollIndex={safeInitialIndex}
        snapToInterval={ITEM_H}
        snapToAlignment="start"
        decelerationRate="fast"
        onScrollBeginDrag={onScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderItem}
        ListHeaderComponent={<View style={headerFooterStyle} />}
        ListFooterComponent={<View style={headerFooterStyle} />}
        // 추가 성능 최적화 props
        windowSize={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={7}
      />
    );
  },
);

Wheel.displayName = "Wheel";

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    gap: responsiveWidth(10),
    paddingVertical: responsiveHeight(8),
    marginTop: responsiveHeight(5),
  },
  col: { alignItems: "center" },
  list: {
    height: ITEM_H * 5,
    width: responsiveWidth(90),
    borderRadius: 16,
    backgroundColor: COLORS.background.secondaryLightGray,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
    shadowColor: COLORS.shadow.black,
  },
  item: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: responsiveFontSize(22),
    fontWeight: "700",
    letterSpacing: -0.2,
    color: COLORS.font.dark,
  },
  unit: {
    marginTop: responsiveHeight(8),
    color: COLORS.text.gray,
    fontSize: responsiveFontSize(12),
  },
  sep: {
    fontSize: responsiveFontSize(22),
    fontWeight: "700",
    color: COLORS.font.dark,
    marginHorizontal: responsiveWidth(6),
    alignSelf: "center",
    paddingBottom: responsiveHeight(20),
  },
  centerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ITEM_H,
    top: ITEM_H * 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border.lightGray,
    backgroundColor: "rgba(255, 69, 0, 0.06)",
    borderRadius: 8,
  },
});

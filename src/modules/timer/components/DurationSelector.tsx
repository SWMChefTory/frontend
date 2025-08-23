import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

type Props = {
  hours?: number;
  minutes: number;
  seconds: number;
  onChange: (h: number, m: number, s: number) => void;
  hourMax?: number;
  minuteMax?: number;
  showHours?: boolean;
};

const ITEM_H = 42;

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

  useEffect(() => {
    if (isScrolling) return;

    const scrollToPosition = (
      ref: React.RefObject<FlatList<number> | null>,
      value: number,
      maxLength: number,
    ) => {
      if (ref.current) {
        const safeIndex = Math.max(0, Math.min(maxLength - 1, value));
        setTimeout(() => {
          ref.current?.scrollToIndex({
            index: safeIndex,
            animated: true,
          });
        }, 100);
      }
    };

    if (showHours) {
      scrollToPosition(hourRef, hours, hourData.length);
    }
    scrollToPosition(minRef, minutes, minData.length);
    scrollToPosition(secRef, seconds, secData.length);
  }, [
    hours,
    minutes,
    seconds,
    showHours,
    hourData.length,
    minData.length,
    secData.length,
    isScrolling,
  ]);

  const handleScrollBegin = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleScrollEnd = useCallback(
    (type: "hour" | "minute" | "second") =>
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.y / ITEM_H);

        let clampedIndex: number;
        if (type === "hour") {
          clampedIndex = Math.max(0, Math.min(hourData.length - 1, index));
          onChange(clampedIndex, minutes, seconds);
        } else if (type === "minute") {
          clampedIndex = Math.max(0, Math.min(minData.length - 1, index));
          onChange(hours, clampedIndex, seconds);
        } else {
          clampedIndex = Math.max(0, Math.min(secData.length - 1, index));
          onChange(hours, minutes, clampedIndex);
        }

        setIsScrolling(false);
      },
    [
      hourData.length,
      minData.length,
      secData.length,
      hours,
      minutes,
      seconds,
      onChange,
    ],
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
                onMomentumScrollEnd={handleScrollEnd("hour")}
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
            onMomentumScrollEnd={handleScrollEnd("minute")}
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
            onMomentumScrollEnd={handleScrollEnd("second")}
          />
          <View style={styles.centerLine} />
        </View>
        <Text style={styles.unit}>초</Text>
      </View>
    </View>
  );
}

function Wheel({
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
  onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const safeInitialIndex = useMemo(() => {
    return Math.max(0, Math.min(data.length - 1, value));
  }, [data.length, value]);

  return (
    <FlatList
      ref={refList}
      data={data}
      keyExtractor={(n) => String(n)}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={false}
      getItemLayout={(_, index) => ({
        length: ITEM_H,
        offset: ITEM_H * index,
        index,
      })}
      initialScrollIndex={safeInitialIndex}
      snapToInterval={ITEM_H}
      snapToAlignment="start"
      decelerationRate="fast"
      onScrollBeginDrag={onScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemText}>
            {item.toString().padStart(2, "0")}
          </Text>
        </View>
      )}
      ListHeaderComponent={<View style={{ height: ITEM_H * 2 }} />}
      ListFooterComponent={<View style={{ height: ITEM_H * 2 }} />}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  col: { alignItems: "center" },
  list: {
    height: ITEM_H * 5,
    width: 96,
    borderRadius: 16,
    backgroundColor: COLORS.background.secondaryLightGray,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
    shadowColor: COLORS.shadow.black,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  item: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: COLORS.font.dark,
  },
  unit: {
    marginTop: 8,
    color: COLORS.text.gray,
    fontSize: 12,
  },
  sep: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.font.dark,
    marginHorizontal: 6,
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

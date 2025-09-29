// WheelPicker.tsx
import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,

} from "react-native";
import Animated, {
  useSharedValue,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import {
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";

type Props = {
  rowCount: number;
  value: number;
  rowHeight?: number;
  zeroPadding?: boolean;
  onChange?: (index: number) => void;
  presetRef: React.RefObject<PresetRef|null>;
};

export interface PresetRef{
    onScrollByPreset: (data: number) => void;
}

export default function WheelPicker({
  rowCount,
  rowHeight= 48,
  value,
  zeroPadding = false,
  onChange,
  presetRef,
}: Props) {
  const visibleCount = 3;
  const listHeight = rowHeight * visibleCount;
  const scrollY = useSharedValue(0);
  const listRef = useRef<FlatList<number>>(null);
  const repeats =3;

  useEffect(()=>{
    const onScrollByPreset = (data: number)=>{
        const currentIndex = Math.round(scrollY.value / rowHeight);
        const repeatedN = Math.floor(currentIndex / rowCount);
        const target = repeatedN * rowCount + data;
        listRef.current?.scrollToIndex({index: target});
      }
      if(!presetRef.current){
        presetRef.current = {
            onScrollByPreset
        }
      }
  }, [presetRef])

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  //scroll에서 animated false로 처리했기 때문에 onMomentumScrollEnd 호출 되지 않음.
  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / rowHeight);
      const value = ((index % rowCount) + rowCount) % rowCount;
      const target = rowCount * Math.floor(repeats / 2) + value;
      console.log("onScrollEnd value", value);
      onChange?.(value);
      if (index !== target) {
        listRef.current?.scrollToIndex({ index: target, animated: false });
      }
    },
    [rowCount, onChange]
  );

  const paddingVerticalOfList = (listHeight - rowHeight) / 2;

  return (
    <View
      style={{
        height: listHeight,
      }}
    >
      <Animated.FlatList
        ref={listRef}
        data={Array.from({ length: repeats * rowCount }, (_, i) => i % rowCount)}
        keyExtractor={(v, i) => String(v) + i}
        showsVerticalScrollIndicator={false}
        bounces={false}
        snapToInterval={rowHeight}
        decelerationRate="normal"
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialScrollIndex={rowCount * Math.floor(repeats / 2) + value}
        contentContainerStyle={{ paddingVertical: paddingVerticalOfList }}
        getItemLayout={(_, i) => ({
          length: rowHeight,
          offset: rowHeight * i,
          index: i,
        })}
        onMomentumScrollEnd={(e) => {
          onScrollEnd(e);
        }}
        renderItem={({ item, index }) => (
          <WheelRow
            item={item}
            index={index}
            itemHeight={rowHeight}
            itemH={rowHeight}
            listH={listHeight}
            scrollY={scrollY}
            zeroPadding={zeroPadding}
          />
        )}
      />
    </View>
  );
}

type RowProps = {
  item: number;
  index: number;
  itemHeight: number;
  itemH: number;
  listH: number;
  scrollY: SharedValue<number>;
  zeroPadding: boolean;
};

const WheelRow = React.memo(function WheelRow({
  item,
  index,
  itemHeight,
  itemH,
  listH,
  scrollY,
  zeroPadding,
}: RowProps) {
  const textStyle = useAnimatedStyle(() => {
    const itemCenter = index * itemHeight + itemHeight / 2; //아이템의 가운데 부분
    const viewportCenter = scrollY.value + itemH / 2; //뷰포트는 전체 아이템의 크기이고, 이 변수는 뷰포트의 가운데
    const dist = itemCenter - viewportCenter;
    const distAbs = Math.abs(dist);
    const scale = interpolate(
      distAbs,
      [0, itemHeight, itemHeight * 2],
      [1.0, 0.9, 0.8],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      distAbs,
      [0, itemHeight, itemHeight * 2],
      [1.0, 0.4, 0.6],
      Extrapolation.CLAMP
    );

    return { transform: [{ scale }], opacity };
  }, [index, itemHeight, listH]);

  const formattedItem = (
    () => {
        if (zeroPadding) {
          if (item < 10) {
            return `0${item}`;
          }
          return item;
        }
        return item.toString();
      }
  )();

  return (
    <Animated.View
      style={[
        styles.row,
        {
          alignItems: "flex-end",
          justifyContent: "center",
          height: itemHeight,
          overflow: "visible",
          paddingRight: 4,
        },
      ]}
    >
      <Animated.Text
        allowFontScaling={false}
        style={[
          styles.label,
          {
            color: "black",
          },
          textStyle,
        ]}
      >
        {formattedItem}
      </Animated.Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  row: { alignItems: "center", justifyContent: "center" },
  label: {
    fontSize: responsiveFontSize(24),
    fontFamily: "Pretendard-SemiBold",
    fontWeight: "700",
    lineHeight: 32,

    includeFontPadding: false,
    fontVariant: ["tabular-nums", "lining-nums"],
  },
});

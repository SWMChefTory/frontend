import { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "@/src/modules/shared/utils/responsiveUI";
import WheelPicker, { PresetRef } from "./WheelPicker";
import { Chip } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";

type Props = {
  hours?: number;
  minutes: number;
  seconds: number;
  changeHours: (h: number) => void;
  changeMinutes: (m: number) => void;
  changeSeconds: (s: number) => void;
};

const HOUR_COUNT = 10;
const MINUTE_COUNT = 60;
const SECOND_COUNT = 60;

const enum PresetUnit {
  SECOND = "SECOND",
  MINUTE = "MINUTE",
  HOUR = "HOUR",
}

const DEFAULT_TIMER_PRESETS = [
  { label: "30초", value: 30, unit: PresetUnit.SECOND },
  { label: "1분", value: 1, unit: PresetUnit.MINUTE },
  { label: "5분", value: 5, unit: PresetUnit.MINUTE },
  { label: "15분", value: 15, unit: PresetUnit.MINUTE },
  { label: "30분", value: 30, unit: PresetUnit.MINUTE },
];

type Preset = { label: string; value: number; unit: PresetUnit };

export default function DurationSelector({
  hours = 0,
  minutes,
  seconds,
  changeHours,
  changeMinutes,
  changeSeconds,
}: Props) {
  const presetSecondRef = useRef<PresetRef>(null);
  const presetMinuteRef = useRef<PresetRef>(null);
  const presetHourRef = useRef<PresetRef>(null);
  console.log("hours", hours);
  console.log("minutes", minutes);
  console.log("seconds", seconds);

  function handlePresetChange({hours, minutes, seconds}: {hours: number, minutes: number, seconds: number}) {
    presetHourRef.current?.onScrollByPreset(hours);
    presetMinuteRef.current?.onScrollByPreset(minutes);
    presetSecondRef.current?.onScrollByPreset(seconds);
  }

  return (
    <View style={[styles.wrap]}>
      <View style={[{ width: "92%" , flexDirection: "row"}]}>
        <View
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            backgroundColor: COLORS.background.gray,
            height: 40,
            width: "100%",
            borderRadius: 10,
            opacity: 0.2,
          }}
        ></View>
        <View style={styles.col}>
          <View style={styles.list}>
            <WheelPicker
              presetRef={presetHourRef}
              rowCount={HOUR_COUNT}
              value={hours}
              onChange={(index) => {
                changeHours(index);
              }}
            />
            <View style={styles.unitWrap}>
              <Text style={styles.unit}>시간</Text>
            </View>
          </View>
        </View>

        <View style={styles.col}>
          <View style={styles.list}>
            <WheelPicker
              presetRef={presetMinuteRef}
              rowCount={MINUTE_COUNT}
              value={minutes}
              onChange={(index) => {
                changeMinutes(index);
              }}
              zeroPadding={true}
            />

            <View style={styles.unitWrap}>
              <Text style={styles.unit}>분</Text>
            </View>
          </View>
        </View>

        <View style={styles.col}> 
          <View style={styles.list}>
            <WheelPicker
              presetRef={presetSecondRef}
              rowCount={SECOND_COUNT}
              value={seconds}
              onChange={(index) => {
                changeSeconds(index);
              }}
              zeroPadding={true}
            />
            <View style={styles.unitWrap}>
              <Text style={styles.unit}>초</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{height: responsiveHeight(80)}}/>
      <View style={[{ width: "92%" }]}>
        <FlatList
          data={DEFAULT_TIMER_PRESETS}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={[{ paddingHorizontal: responsiveWidth(2) }]}>
                <Chip
                  mode="outlined"
                  style={[
                    {
                      backgroundColor: COLORS.background.secondaryLightGray,
                    },
                  ]}
                  onPress={() => {
                    if (item.unit === PresetUnit.SECOND) {
                      handlePresetChange({hours: 0, minutes: 0, seconds: item.value});
                    } else if (item.unit === PresetUnit.MINUTE) {
                      handlePresetChange({hours: 0, minutes: item.value, seconds: 0});
                    } else if (item.unit === PresetUnit.HOUR) {
                      handlePresetChange({hours: item.value, minutes: 0, seconds: 0});
                    }
                  }}
                >
                  {item.label}
                </Chip>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "column",
    marginTop: responsiveHeight(64),
    width: "96%",
    alignItems: "center",
  },
  col: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  list: {
    // width: responsiveWidth(90),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  unitWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  unit: {
    color: "black",
    fontSize: responsiveFontSize(24),
    paddingTop: 0.5,
    fontWeight: "700",
    fontVariant: ["tabular-nums", "lining-nums"],
  },
});

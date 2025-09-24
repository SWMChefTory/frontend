import { memo, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import DurationSelector from "@/src/widgets/timer/components/DurationSelector";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../modules/shared/utils/responsiveUI";

const DEFAULT_TIMER_PRESETS = [
  { label: "30초", seconds: 30, color: COLORS.orange.main },
  { label: "1분", seconds: 60, color: COLORS.orange.main },
  { label: "5분", seconds: 300, color: COLORS.orange.main },
  { label: "15분", seconds: 900, color: COLORS.orange.main },
  { label: "30분", seconds: 1800, color: COLORS.orange.main },
];

type Preset = { label: string; seconds: number; color?: string };

type TimerIdleProps = {
  onTimeChange: (totalSeconds: number) => void;
  onStart: () => void;
  onClose: () => void;
  isStartDisabled?: boolean;
  initialSeconds?: number;
};

export const TimerIdle = memo(
  ({
    onTimeChange,
    onStart,
    onClose,
    isStartDisabled = false,
    initialSeconds = 0,
  }: TimerIdleProps) => {
    const presets = DEFAULT_TIMER_PRESETS;

    const secondsToHMS = (totalSeconds: number) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return { hours, minutes, seconds };
    };

    const initialHMS = secondsToHMS(initialSeconds);
    const [hours, setHours] = useState(initialHMS.hours);
    const [minutes, setMinutes] = useState(initialHMS.minutes);
    const [seconds, setSeconds] = useState(initialHMS.seconds);

    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(() => {
      const matchingPreset = presets.find((p) => p.seconds === initialSeconds);
      return matchingPreset || (initialSeconds === 0 ? presets[0] : null);
    });

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const isCustom = useMemo(() => {
      if (!selectedPreset) return true;
      return totalSeconds !== selectedPreset.seconds;
    }, [totalSeconds, selectedPreset]);

    const formatDuration = (h: number, m: number, s: number) => {
      const parts = [];
      if (h > 0) parts.push(`${h}시`);
      if (m > 0) parts.push(`${m}분`);
      if (s > 0) parts.push(`${s}초`);
      return parts.join(" ") || "0초";
    };

    const formattedDuration = formatDuration(hours, minutes, seconds);

    const handlePresetSelect = (preset: Preset) => {
      const hms = secondsToHMS(preset.seconds);
      setHours(hms.hours);
      setMinutes(hms.minutes);
      setSeconds(hms.seconds);
      setSelectedPreset(preset);
      onTimeChange(preset.seconds);
    };

    const handleTimeChange = (h: number, m: number, s: number) => {
      setHours(h);
      setMinutes(m);
      setSeconds(s);

      const newTotalSeconds = h * 3600 + m * 60 + s;

      const matchingPreset = presets.find((p) => p.seconds === newTotalSeconds);
      setSelectedPreset(matchingPreset || null);

      onTimeChange(newTotalSeconds);
    };

    const canStart = totalSeconds > 0 && !isStartDisabled;

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.label}>시간 설정</Text>
          <DurationSelector
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            showHours={true}
            hourMax={23}
            onChange={handleTimeChange}
          />
          {isCustom ? (
            <Text style={styles.customBadge}>{formattedDuration}</Text>
          ) : selectedPreset ? (
            <Text style={styles.normalBadge}>{selectedPreset.label}</Text>
          ) : null}
          <Text style={styles.label}>빠른 설정</Text>
          <View style={styles.presetRow}>
            {presets.map((p) => {
              const selected =
                !!selectedPreset &&
                p.label === selectedPreset.label &&
                !isCustom;
              return (
                <TouchableOpacity
                  key={p.label}
                  onPress={() => handlePresetSelect(p)}
                  style={[styles.preset, selected && styles.presetSelected]}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.presetText,
                      selected && styles.presetSelectedText,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.btn, styles.btnGhost]}
            onPress={onClose}
          >
            <Text style={styles.btnGhostText}>종료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              styles.btnPrimary,
              !canStart && styles.btnDisabled,
            ]}
            onPress={onStart}
            disabled={!canStart}
          >
            <Text
              style={[
                styles.btnPrimaryText,
                !canStart && styles.btnDisabledText,
              ]}
            >
              시작
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  label: {
    color: COLORS.text.black,
    opacity: 0.7,
    fontSize: responsiveFontSize(12),
    marginTop: responsiveHeight(10),
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: responsiveWidth(10),
    marginTop: responsiveHeight(8),
  },
  preset: {
    flex: 1,
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(10),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  presetSelected: {
    backgroundColor: COLORS.orange.light,
    borderColor: "transparent",
  },
  presetText: {
    color: COLORS.font.dark,
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
  },
  presetSelectedText: {
    color: COLORS.text.black,
    fontSize: responsiveFontSize(14),
    fontWeight: "800",
  },
  customBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(6),
    fontSize: responsiveFontSize(14),
    borderRadius: 999,
    backgroundColor: "rgba(255,69,0,0.12)",
    color: COLORS.text.black,
    fontWeight: "700",
    overflow: "hidden",
  },
  normalBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(6),
    fontSize: responsiveFontSize(14),
    borderRadius: 999,
    backgroundColor: "rgba(255,69,0,0.12)",
    color: COLORS.text.black,
    fontWeight: "700",
    overflow: "hidden",
  },
  btnDisabled: {
    backgroundColor: COLORS.background.secondaryLightGray,
    opacity: 0.6,
  },
  btnDisabledText: {
    color: COLORS.text.gray,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: responsiveHeight(10),
    alignItems: "flex-start",
    justifyContent: "center",
  },
  statusText: {
    marginTop: responsiveHeight(8),
    color: COLORS.text.gray,
    fontSize: responsiveWidth(16),
    fontWeight: "600",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    paddingTop: responsiveHeight(16),
    gap: responsiveWidth(12),
  },
  btn: {
    flex: 1,
    paddingVertical: responsiveHeight(14),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  btnPrimary: {
    backgroundColor: COLORS.orange.main,
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  btnSecondary: {
    backgroundColor: COLORS.background.secondaryLightGray,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  btnSecondaryText: {
    color: COLORS.font.dark,
    fontWeight: "700",
  },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  btnGhostText: {
    color: COLORS.text.gray,
    fontWeight: "700",
  },
});

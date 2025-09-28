import { memo, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import DurationSelector from "@/src/widgets/timer/components/DurationSelector";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "@/src/modules/shared/utils/responsiveUI";
import { Button } from "react-native-paper";

type TimerIdleProps = {
  onStart: (totalSeconds: number) => void;
  onClose: () => void;
  initialSeconds?: number;
};

export const TimerIdle = memo(
  ({ onStart, onClose, initialSeconds = 0 }: TimerIdleProps) => {
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

    const totalMilliSec = (hours * 3600 + minutes * 60 + seconds)*1000;
    const isStartDisabled = totalMilliSec <= 0;

    const canStart = totalMilliSec > 0 && !isStartDisabled;

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <DurationSelector
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            changeHours={setHours}
            changeMinutes={setMinutes}
            changeSeconds={setSeconds}
          />
          <View style={[{ position: "absolute", bottom: 24, zIndex: 1, width: "92%" , alignItems: "center" }]}>
            <View style={[{ height: responsiveHeight(1), backgroundColor: "black",width: "100%", opacity: 0.5 }]}/>
            <View style={[{ height: responsiveHeight(16) }]}/>
              <Button
                mode="contained"
                icon="play"
                style={{
                  width: "92%",
                  justifyContent: "center",
                  flexDirection: "row-reverse",
                  borderRadius: 8,
                }}
                onPress={() => onStart(totalMilliSec)}
                disabled={!canStart}
              >
                시작
              </Button>
            
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  label: {
    color: COLORS.text.black,
    opacity: 0.7,
    fontSize: responsiveFontSize(12),
    marginTop: responsiveHeight(72),
    alignItems: "center",
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: responsiveWidth(10),
    width: "80%",
    marginTop: responsiveHeight(80),
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
    alignItems: "center",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    marginTop: responsiveHeight(10),
    alignItems: "center",
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

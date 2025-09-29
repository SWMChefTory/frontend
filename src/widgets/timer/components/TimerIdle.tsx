import { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import DurationSelector from "@/src/widgets/timer/components/DurationSelector";
import TimerControlSection from "@/src/widgets/timer/components/TimerControlSection";

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
          <DurationSelector
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            changeHours={setHours}
            changeMinutes={setMinutes}
            changeSeconds={setSeconds}
          />
          <TimerControlSection
            buttonsProps={[{ label: "시작", icon: "play", isEmphasis: true, onPress: () => onStart(totalMilliSec), disabled: !canStart }]}
            width={"92%"}
          />
        </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
  }
});

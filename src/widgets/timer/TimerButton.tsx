import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useTimer } from "@/src/widgets/timer/hooks/useTimer";
import { TimerState } from "./hooks/store/useTimerSnapshotStore";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { TimerProgress } from "./components/TimerProgress";
import { IconButton } from "react-native-paper";

interface TimerButtonProps {
  onPress: () => void;
}

export default function TimerButton({ onPress }: TimerButtonProps) {
  const {
    state,
    totalMilliSec,
    remainingMilliSec,
    autoActions: { finish },
  } = useTimer();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: responsiveWidth(66),
        height: responsiveWidth(66),
        borderRadius: responsiveWidth(66),
        overflow: "hidden",
      }}
    >
      {state === TimerState.IDLE ? (
        <IconButton
          icon="timer-outline"
          onPress={onPress}
          size={responsiveWidth(66)}
        />
      ) : (
        <Pressable onPress={onPress}>
          <TimerProgress
            state={state}
            totalMilliSec={totalMilliSec}
            remainingMilliSec={remainingMilliSec || 0}
            isFromBackground={false}
            onFinish={() => {
              finish();
            }}
            size={responsiveWidth(66)}
            stroke={responsiveWidth(5)}
          />
        </Pressable>
      )}
    </View>
  );
}

import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useTimer } from "@/src/widgets/timer/hooks/useTimer";
import {
  ActiveTimeInfo,
  PausedTimeInfo,
  TimerState,
} from "./hooks/store/useTimerSnapshotStore";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { TimerProgress } from "./components/TimerProgress";

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


  if (state === TimerState.IDLE) {
    return null;
  }

  return (
    <View style={{alignItems: "center", justifyContent: "center"}}>
      
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
      
    </View>
  );
}

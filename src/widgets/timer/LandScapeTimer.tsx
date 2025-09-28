import { Platform, TouchableOpacity, View, Text } from "react-native";
import Modal from "react-native-modal";
import { useTimer } from "./hooks/useTimer";
import { useState } from "react";
import { TimerIdle } from "./components/TimerIdle";
import { TimerState } from "./hooks/store/useTimerSnapshotStore";
import {IconButton} from "react-native-paper";

export default function RandscapeTimer({ handleClose }: { handleClose: () => void }) {
  const { state, remainingMilliSec } = useTimer();  
  const [totalMilliSecInputValue, setTotalMilliSecInputValue] =
    useState<number>(0);


  return (
    <Modal
      isVisible={true}
      onBackdropPress={handleClose}
      animationIn="slideInRight" // ← 오른쪽에서 슬라이드 인
      animationOut="slideOutRight" // ← 오른쪽으로 슬라이드 아웃
      style={{
        margin: 0,
        alignItems: "flex-end",
        ...(Platform.OS === "android" && { elevation: 999 }),
      }}
      backdropOpacity={0.5}
      useNativeDriver={true} // 성능 향상
      hideModalContentWhileAnimating={true}
    >
      <View
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "36%",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          paddingRight: 30,
          padding: 20,
          ...(Platform.OS === "android" && { elevation: 999 }),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 32,
          }}
        >
          <IconButton icon="close" onPress={handleClose} />

        </View>

        {state === TimerState.IDLE && (
          <TimerIdle
            initialSeconds={totalMilliSecInputValue}
            onStart={(number) => {}}
            onClose={handleClose}
          />
        )}
        

      </View>
    </Modal>
  );
}

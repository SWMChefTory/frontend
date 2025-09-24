import { Platform, TouchableOpacity, View, Text } from "react-native";
import Modal from "react-native-modal";

export default function RandscapeTimer({ handleClose }: { handleClose: () => void }) {
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
          padding: 20,
          ...(Platform.OS === "android" && { elevation: 999 }),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 16,
            paddingRight: 32,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", }}>Timer</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
